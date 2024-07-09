<script>
  import { searchResults } from '$lib/data/searchStore'; // Import store

  // Subscribe to searchResults store to get data
  $: results = $searchResults;
</script>

{#if results.length > 0}
  <div class="search-results">
    <ul>
      {#each results as result}
        <li>
          <h3><a href={result.slug}>{result.title}</a></h3>
          <p>{result.description}</p>
        </li>
      {/each}
    </ul>
  </div>
{:else}
  <p>No results found.</p>
{/if}

<style>
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
</style>
