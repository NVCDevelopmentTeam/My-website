<script>
  import { writable } from 'svelte/store';
  import { get } from 'svelte/store';
  import { search } from '$lib/data/searchHandlers'; // Import search function from handlers
  import { searchQuery, searchResults } from '$lib/data/searchStore'; // Import stores

  async function handleSubmit(event) {
    event.preventDefault();
    const query = get(searchQuery);

    try {
      const results = await search(query); // Call search function from handlers
      searchResults.set(results);
      document.getElementById('search').value = '';
    } catch (error) {
      console.error(error);
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
    }
  }
</script>

<div class="search">
  <form on:submit={handleSubmit}>
    <input type="text" name="search" class="search" id="search" aria-label="search" bind:value={$searchQuery}>
    <button type="button" class="voice-search" title="Search by voice" aria-label="Search by voice" on:click={handleVoiceSearch}>
      <i class="fa fa-microphone"></i>
    </button>
    <button type="submit" title="search" aria-label="search">Search</button>
  </form>

  {#if $searchResults.length > 0}
    <div class="search-results">
      <ul>
        {#each $searchResults as result}
          <li>
            <h3><a href={result.slug}>{result.title}</a></h3>
            <p>{result.description}</p>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style>
  .search {
    display: flex;
    align-items: center;
  }
  .search input[type="text"] {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    flex: 1;
  }
  .search button[type="submit"],
  .search button.voice-search {
    margin-left: 8px;
    padding: 8px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .search button[type="submit"]:hover,
  .search button.voice-search:hover {
    background-color: #0062cc;
  }
  .fa {
    font-size: 16px;
  }
</style>
