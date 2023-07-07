<script>
  import { writable } from 'svelte/store';
  import { get } from 'svelte/store'
  import hljs from 'highlight.js/lib/core';
  import javascript from 'highlight.js/lib/languages/javascript';
  import 'highlight.js/styles/github.css';
  
  import { search } from '$lib/data/search.js';
  
  hljs.registerLanguage('javascript', javascript);

  export const searchQuery = writable('');
  export const searchResults = writable([]);

  function handleChange(event) {
    searchQuery.set(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const query = get(searchQuery);

    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?q=${query}`);
      const results = await response.json();
      
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
        handleSubmit(event);
      }

      recognition.start();
    }
  }
</script>

<div class="search">
  <form on:submit={handleSubmit}>
    <input type="text" name="search" class="search" id="search" aria-label="search" on:input={handleChange} bind:value={$searchQuery}>
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
            <h3><a href={result.url}>{result.title}</a></h3>
            <pre>
              <code class="javascript" data-dynamic>
                {@html result.code.replaceAll('>', '&gt;').replaceAll('<', '&lt;')}
              </code>
            </pre>
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

  .search button[type="submit"] {
    margin-left: 8px;
    padding: 8px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .search button[type="submit"]:hover {
    background-color: #0062cc;
  }

  .search button.voice-search {
    margin-left: 8px;
    padding: 8px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .search button.voice-search:hover {
    background-color: #0062cc;
  }

  .fa {
    font-size: 16px;
  }

  .search-results {
    margin-top: 16px;
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

  .search-results code {
    display: block;
    overflow-x: auto;
    background-color: #f7f7f7;
    font-size: 14px;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
</style>
