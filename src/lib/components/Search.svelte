<script>
  import { run } from 'svelte/legacy';

  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { searchQuery, searchResults, isLoading, noResults, search } from '$lib/data/search';
  import { browser } from '$app/environment';

  let voiceSearchSupported = $state(false);
  let recognition;
  let isListening = $state(false);
  let query = $state('');
  let audioContext;
  let audioBuffers = {};
  let isVoiceSearch = false; // Flag to indicate voice search usage
  const audioFilePath = '/src/lib/sounds';

  run(() => {
    query = page?.url?.searchParams?.get('q') || '';
  });

  onMount(() => {
    if (browser) {
      voiceSearchSupported = 'webkitSpeechRecognition' in window;
      if (voiceSearchSupported) {
        setupVoiceRecognition();
      }
      initializeAudio();
      if (query) {
        searchQuery.set(query);
        performSearch(query);
      }
    }
  });

  function setupVoiceRecognition() {
    recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'Vi-VN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      isListening = true;
      isVoiceSearch = true; // Indicate voice search started
      playAudio('start-search');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      searchQuery.set(transcript);
      recognition.stop();
      performSearch(transcript);
    };

    recognition.onend = () => {
      isListening = false;
      if (!isVoiceSearch) return; // Ensure this block is only for voice search

      // Play stop sound when user manually stops voice search
      playAudio('error');

      // If no results were found and search was via voice
      if (!searchResults.length && !noResults) {
        playAudio('error');
      }
      isVoiceSearch = false;
    };

    recognition.onerror = (event) => {
      isListening = false;
      console.error('Voice recognition error:', event.error);
      playAudio('error');
      isVoiceSearch = false;
    };
  }

  async function initializeAudio() {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioFiles = ['start-search', 'no-results', 'error', 'search-results', 'error'];

      for (const file of audioFiles) {
        const response = await fetch(`${audioFilePath}/${file}.mp3`);
        const arrayBuffer = await response.arrayBuffer();
        audioBuffers[file] = await audioContext.decodeAudioData(arrayBuffer);
      }
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  }

  function playAudio(audioType) {
    if (audioContext && audioBuffers[audioType]) {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffers[audioType];
      source.connect(audioContext.destination);
      source.start();
    }
  }

  async function performSearch(queryText) {
    const trimmedQuery = queryText.trim();
    if (!trimmedQuery) {
      alert('Please enter search keywords.');
      return;
    }

    try {
      isLoading.set(true);
      await search(trimmedQuery);

      if (isVoiceSearch) {
        // Play sound only for voice search results
        if ($searchResults.length > 0) {
          playAudio('search-results');
        } else {
          playAudio('no-results');
        }
      }

      await goto(`/search-results?q=${encodeURIComponent(trimmedQuery)}`, { replaceState: true });
    } catch (error) {
      console.error('Error performing search:', error);
      if (isVoiceSearch) playAudio('error');
    } finally {
      isLoading.set(false);
      isVoiceSearch = false; // Reset voice search flag after search
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    isVoiceSearch = false; // Indicate this is text search
    performSearch($searchQuery);
  }

  function handleVoiceSearch() {
    if (!voiceSearchSupported || !recognition) {
      alert('Your browser does not support voice search.');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      searchQuery.set('');
      recognition.start();
    }
  }
</script>

<!-- Main search container and form -->
<div>
  <form onsubmit={handleSubmit}>
    <input 
      type="text"
      name="search"
      id="search"
      aria-label="Search"
      bind:value={$searchQuery}
      placeholder="Enter keyword..."
      autocomplete="off"
    />
    {#if voiceSearchSupported}
      <button 
        type="button"
        title={isListening ? "Stop voice search" : "Voice search"}
        aria-label={isListening ? "Stop voice search" : "Voice search"}
        onclick={handleVoiceSearch}
      >
        {isListening ? 'Stop Voice Search' : 'Start Voice Search'}
      </button>
    {/if}
    <button 
      type="submit"
      title="Search"
      aria-label="Search"
      disabled={$isLoading}
    >
      {$isLoading ? 'Searching...' : 'Search'}
    </button>
  </form>
</div>
