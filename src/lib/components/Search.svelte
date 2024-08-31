<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { searchQuery, search, isLoading } from '$lib/data/search';
  import { browser } from '$app/environment';
  import { get } from 'svelte/store';

  let voiceSearchSupported = false;
  let recognition = null;
  let isListening = false;
  let query = ''; 

  // Lấy query từ URL nếu có
  $: if (page && page.url) {
    query = page.url.searchParams.get('q') || '';
  }

  // Khởi tạo các chức năng khi component được gắn vào DOM
  onMount(() => {
    if (browser) {
      voiceSearchSupported = 'webkitSpeechRecognition' in window;

      if (voiceSearchSupported) {
        setupVoiceRecognition();
      }

      // Nếu có query từ URL, thực hiện tìm kiếm ngay
      if (query) {
        searchQuery.set(query);
        performSearch(query);
      }
    }
  });

  // Cài đặt nhận diện giọng nói
  function setupVoiceRecognition() {
    recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      isListening = true;
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      searchQuery.set(transcript);
      recognition.stop();
      performSearch(transcript);
    };

    recognition.onend = () => {
      isListening = false;
    };

    recognition.onerror = (event) => {
      isListening = false;
      console.error('Lỗi nhận diện giọng nói', event.error);
    };
  }

  // Thực hiện tìm kiếm khi có từ khóa
  async function performSearch(queryText) {
    const trimmedQuery = queryText.trim();
    if (!trimmedQuery) {
      alert('Vui lòng nhập từ khóa tìm kiếm.');
      return;
    }

    try {
      isLoading.set(true);
      await search(trimmedQuery);
      await goto(`/Search-results?q=${encodeURIComponent(trimmedQuery)}`, { replaceState: true });
    } catch (error) {
      console.error('Lỗi khi thực hiện tìm kiếm:', error);
    } finally {
      isLoading.set(false);
    }
  }

  // Xử lý sự kiện khi form được submit
  function handleSubmit(event) {
    event.preventDefault();
    performSearch(get(searchQuery));
  }

  // Xử lý sự kiện khi nhấn nút tìm kiếm bằng giọng nói
  function handleVoiceSearch() {
    if (!voiceSearchSupported || !recognition) {
      alert('Trình duyệt của bạn không hỗ trợ tìm kiếm bằng giọng nói.');
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
    />
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
