<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { searchQuery, search, isLoading } from '$lib/data/search';

  let voiceSearchSupported = false;
  let recognition;
  let isListening = false;
  let audioContext;
  let audioBuffers = {};

  // Initialize the component
  onMount(() => {
    const query = $page.url.searchParams.get('q');
    if (query) {
      $searchQuery = query;
      performSearch();
    }
    
    // Check for voice search support
    voiceSearchSupported = 'webkitSpeechRecognition' in window;
    if (voiceSearchSupported) {
      setupVoiceRecognition();
    }

    // Initialize Web Audio API
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    loadAudios();
  });

  // Set up voice recognition
  function setupVoiceRecognition() {
    recognition = new webkitSpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      isListening = true;
      playAudio('start');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      $searchQuery = transcript;
      playAudio('end');
      setTimeout(() => performSearch(), 500); // Delay to allow 'end' sound to play
    };

    recognition.onend = () => {
      isListening = false;
      if (!$searchQuery) {
        playAudio('error');
      }
    };

    recognition.onerror = (event) => {
      isListening = false;
      playAudio('error');
      console.error('Speech recognition error', event.error);
    };
  }

  // Load audio files
  async function loadAudios() {
    const audioFiles = ['start', 'end', 'error', 'success'];
    for (const file of audioFiles) {
      const response = await fetch(`/src/lib/Sound/${file}.mp3`);
      const arrayBuffer = await response.arrayBuffer();
      audioBuffers[file] = await audioContext.decodeAudioData(arrayBuffer);
    }
  }

  // Play audio based on type
  function playAudio(audioType) {
    if (audioBuffers[audioType]) {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffers[audioType];
      source.connect(audioContext.destination);
      source.start();
    }
  }

  // Perform search operation
  async function performSearch() {
    const query = $searchQuery.trim();
    if (!query) {
      playAudio('error');
      return;
    }
    try {
      await search(query);
      goto(`/Search-results?q=${encodeURIComponent(query)}`, { replaceState: true });
      if (isListening) {
        playAudio('success');
      }
    } catch (error) {
      console.error('Error during search:', error);
      playAudio('error');
    }
  }

  // Handle form submission
  function handleSubmit(event) {
    event.preventDefault();
    performSearch();
  }

  // Handle voice search
  function handleVoiceSearch() {
    if (voiceSearchSupported) {
      if (isListening) {
        recognition.stop();
      } else {
        $searchQuery = '';
        recognition.start();
      }
    } else {
      alert('Trình duyệt của bạn không hỗ trợ tìm kiếm bằng giọng nói.');
    }
  }
</script>

<div class="search-container">
  <form on:submit={handleSubmit} class="search-form">
    <input 
      type="text" 
      name="search" 
      class="search-input" 
      id="search" 
      aria-label="Tìm kiếm" 
      bind:value={$searchQuery} 
      placeholder="Nhập từ khóa..."
      autocomplete="off"
    >
    {#if voiceSearchSupported}
      <button 
        type="button" 
        class="voice-search" 
        title={isListening ? "Dừng tìm kiếm bằng giọng nói" : "Tìm kiếm bằng giọng nói"}
        aria-label={isListening ? "Dừng tìm kiếm bằng giọng nói" : "Tìm kiếm bằng giọng nói"}
        on:click={handleVoiceSearch}
      >
        <i class="fa {isListening ? 'fa-stop' : 'fa-microphone'}"></i>
      </button>
    {/if}
    <button 
      type="submit" 
      class="search-button" 
      title="Tìm kiếm" 
      aria-label="Tìm kiếm" 
      disabled={$isLoading}
    >
      {$isLoading ? 'Đang tìm...' : 'Tìm kiếm'}
    </button>
  </form>
</div>
