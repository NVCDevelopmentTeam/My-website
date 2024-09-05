<script>
  import { page } from '$app/stores';
  import { siteTitle } from '$lib/data/config';
  import Pagination from '$lib/components/Pagination.svelte';
  import PostsList from '$lib/components/PostsList.svelte';
  import { goto } from '$app/navigation';

  export let data;

  let posts = [];
  let error = '';
  let totalPosts = 0; // Ensure totalPosts has a default value
  let query = '';
  let currentPage = ''; // Ensure currentPage has a default value

  // Destructure data object and set local variables
  $: {
    if (data) {
      posts = data.results || [];
      error = data.error || '';
      totalPosts = data.total || 0; // Set a default value for total posts
      query = $page.url.searchParams.get('q') || '';
      currentPage = parseInt($page.url.searchParams.get('page') || '1', 10); // Default to page 1
    }
  }

  async function handlePageChange(event) {
    const newPage = event.detail.page;
    const url = new URL(window.location);
    url.searchParams.set('page', newPage.toString());
    url.searchParams.set('q', query); // Ensure the search query is maintained when changing pages
    await goto(url.toString(), { replaceState: true });
  }
</script>

<svelte:head>
  <title>Search results for "{query}" - {siteTitle}</title>
  <meta name="description" content="Search results for keyword '{query}'" />
</svelte:head>

<div class="search-results">
  {#if error}
    <p>{error}</p>
  {:else if posts.length > 0}
    <h1>Search results for "{query}"</h1>
    <div class="mt-8">
      <PostsList posts={posts} />
    </div>
    <Pagination currentPage={currentPage} totalPosts={totalPosts} on:pageChange={handlePageChange} />
  {:else if query}
    <h1>Not found</h1>
    <p>Sorry, there is no content matching your search criteria. Try with other keywords.</p>
  {:else}
    <p>Loading search results...</p>
  {/if}
</div>
