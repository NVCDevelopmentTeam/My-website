<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import Pagination from '$lib/components/Pagination.svelte';
  import PostsList from '$lib/components/PostsList.svelte';
  import { search, searchResults, isLoading } from '$lib/data/search';
  import { siteTitle } from '$lib/data/config';

  let query = '';
  let hasResults = false;
  let hasSearched = false;
  let currentPage = 1;
  let totalPosts = 0;
  let posts = [];

  // Get the query parameter from the URL
  $: query = $page.url.searchParams.get('q') || '';

  // Perform the search when the component is mounted
  onMount(async () => {
    if (query) {
      await performSearch();
    }
  });

  // Function to perform the search and update results
  async function performSearch() {
    try {
      await search(query);
      posts = $searchResults;
      hasResults = posts.length > 0;
      hasSearched = query.length > 0;
      totalPosts = $searchResults.length; // Adjust based on actual data structure
      console.log('Search results:', posts); // Debugging
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  }
</script>

<svelte:head>
  <title>Search results for "{decodeURIComponent(query)}" - {siteTitle}</title>
  <meta name="description" content={`Search results for keyword "${decodeURIComponent(query)}"`} />
</svelte:head>

<div class="search-results-container">
  {#if hasSearched}
    {#if $isLoading}
      <p>Loading results...</p>
    {:else if !hasResults}
      <h1>Not found</h1>
      <p>Sorry, there is no content matching your search request. Try again with other keywords.</p>
    {:else}
      <h1>Search results for "{decodeURIComponent(query)}"</h1>
      <div class="mt-8">
        <!-- Pass the search results to PostsList -->
        <PostsList posts={posts} />
      </div>
    {/if}
  {/if}
  <Pagination currentPage={currentPage} totalPosts={totalPosts} />
</div>
