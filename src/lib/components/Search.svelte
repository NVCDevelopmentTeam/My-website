<script>
  import { writable } from 'svelte/store';
  import { get } from 'svelte/store';
  import { searchQuery, searchResults, search } from '$lib/data/search'; // Import search function and stores

  let hasSearched = false; // Track if user has performed a search

  async function handleSubmit(event) {
    event.preventDefault();
    const query = get(searchQuery).trim();

    if (!query) {
      alert('Vui lòng nhập từ khóa tìm kiếm.');
      return;
    }

    hasSearched = true; // User has performed a search

    try {
      const results = await search(query);
      searchResults.set(results);
      document.getElementById('search').value = ''; // Clear input field
    } catch (error) {
      console.error('Error during search:', error);
      searchResults.set([]); // Clear previous results in case of error
    }
  }

  function handleVoiceSearch() {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        searchQuery.set(transcript);
        handleSubmit({ preventDefault: () => {} });
      };
      recognition.start();
    } else {
      alert('Voice search is not supported in this browser.');
    }
  }

  $: results = $searchResults;
</script>

<div class="search-container">
  <form on:submit={handleSubmit} class="search-form">
    <input type="text" name="search" class="search-input" id="search" aria-label="Search" bind:value={$searchQuery} placeholder="Nhập từ khóa...">
    <button type="button" class="voice-search" title="Search by voice" aria-label="Search by voice" on:click={handleVoiceSearch}>
      <i class="fa fa-microphone"></i>
    </button>
    <button type="submit" class="search-button" title="Search" aria-label="Search">Tìm kiếm</button>
  </form>

  {#if results && results.length > 0}
    <div class="search-results">
      <h2>Kết quả tìm kiếm</h2>
      <ul>
        {#each results as result}
          <li class="search-result-item">
            <h3><a href={result.slug} class="search-result-title">{result.title}</a></h3>
            <p class="search-result-description">{result.description}</p>
          </li>
        {/each}
      </ul>
    </div>
  {:else if hasSearched}
    <p class="no-results">Không tìm thấy kết quả tìm kiếm nào.</p>
  {/if}
</div>

<style>
  .search-container {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    background-color: #fff;
  }

  .search-form {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .search-input {
    flex: 1;
    padding: 10px 15px;
    font-size: 16px;
    border: 1px solid #333;
    border-radius: 5px;
  }

  .search-button, .voice-search {
    padding: 10px 15px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #007bff;
    color: #fff;
    transition: background-color 0.3s;
  }

  .search-button:hover, .voice-search:hover {
    background-color: #0056b3;
  }

  .search-results {
    margin-top: 20px;
  }

  .search-result-item {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #333;
    border-radius: 5px;
    background-color: #f9f9f9;
  }

  .search-result-title {
    font-size: 18px;
    color: #007bff;
    text-decoration: none;
  }

  .search-result-title:hover {
    text-decoration: underline;
  }

  .search-result-description {
    margin-top: 5px;
    font-size: 14px;
    color: #333;
  }

  .search-results ul {
    list-style: none;
    padding: 0;
  }

  .search-results li + li {
    margin-top: 16px;
  }

  .search-results h3 {
    margin-bottom: 8px;
  }

  .no-results {
    margin-top: 20px;
    font-size: 16px;
    color: #ff0000;
    text-align: center;
  }
</style>
