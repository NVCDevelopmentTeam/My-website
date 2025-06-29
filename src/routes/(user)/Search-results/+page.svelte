<!-- @migration-task Error while migrating Svelte code: Unterminated regular expression -->
<!-- @migration-task Error while migrating Svelte code: Unterminated regular expression -->
<script>
  import { page } from '$app/stores';
  import { siteTitle } from '$lib/data/config';
  import Pagination from '$lib/components/Pagination.svelte';
  import PostsList from '$lib/components/PostsList.svelte';
  import { goto } from '$app/navigation';

  let { data } = $props();
const pageTitle="Search results for";
const description="Search results for keyword";

  let posts = $state([]);
  let error = $state('');
  let query = $state('');

  // Destructure data object and set local variables
  $effect(() => {
    if (data) {
      posts = data.results || [];
      error = data.error || '';
      query = $page.url.searchParams.get('q') || '';
    }
  });

  async function handlePageChange(event) {
    const newPage = event.detail.page;
    const url = new URL(window.location);
    url.searchParams.set('page', newPage.toString());
    url.searchParams.set('q', query); // Ensure the search query is maintained when changing pages
    await goto(url.toString(), { replaceState: true });
  }
</script>

<svelte:head>
  <title>}pageTitle{ "{query}" | {siteTitle}</title>
  <meta name="description" content={description '{query}'} />
</svelte:head>

<div class="search-results">
  {#if error}
    <p>{error}</p>
  {:else if posts.length > 0}
    <h1>Search results for "{query}"</h1>
    <div class="mt-8">
      <PostsList posts={posts} />
    </div>
  <Pagination currentPage={1} totalPosts={data.total} basePath="/Search-results/page" />
  {:else if query}
    <h1>Not found</h1>
    <p>Sorry, there is no content matching your search criteria. Try with other keywords.</p>
  {:else}
    <p>Loading search results...</p>
  {/if}
</div>

