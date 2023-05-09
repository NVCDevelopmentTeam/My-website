<script>
  import { writable } from 'svelte/store';
  import { get } from 'svelte/store';
  import hljs from 'highlight.js/lib/core';
  import javascript from 'highlight.js/lib/languages/javascript';
  import 'highlight.js/styles/github.css';

  // import the search function
  import { search } from '$lib/data/search.js';
  
  // register the appropriate language(s)
  hljs.registerLanguage('javascript', javascript);

  // this store will keep track of the current search query
  export const searchQuery = writable('');

  // this store will hold the search results
  export const searchResults = writable([]);

  // update the store value whenever the search input value changes
  function handleChange(event) {
    searchQuery.set(event.target.value);
  }

  // function to handle the form submission
  async function handleSubmit(event) {
    event.preventDefault();
    const query = get(searchQuery);

    // call the `get` function to fetch the search results
    const result = await get({ query: { q: query } });

    // update the search results store
    searchResults.set(result.body);

    // reset the search query after submission
    searchQuery.set('');
  }

  // function to handle voice search
  function handleVoiceSearch() {
    const recognition = new window.webkitSpeechRecognition();

    recognition.lang = 'en-US';

    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      searchQuery.set(transcript);
    }

    recognition.start();
  }
</script>

<div class="search">
  <form on:submit={handleSubmit}>
    <input type="text" name="search" class="search" id="search" aria-label="search" on:change={handleChange} bind:value={$searchQuery}>
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
                ${html`${result.code.replaceAll('>', '&gt;').replaceAll('<', '&lt;')}`}
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
