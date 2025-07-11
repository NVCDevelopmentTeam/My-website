<script>
	import { page } from '$app/stores';
	import { siteTitle } from '$lib/data/config';
	import Pagination from '$lib/components/Pagination.svelte';
	import PostsList from '$lib/components/PostsList.svelte';

	let { data } = $props();
	const pageTitle = 'Search results for';
	const description = 'Search results for keyword';

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
</script>

<svelte:head>
	<title>{`${pageTitle} "${query}" | ${siteTitle}`}</title>
	<meta name="description" content={`${description} '${query}'`} />
</svelte:head>

<div class="search-results">
	{#if error}
		<p>{error}</p>
	{:else if posts.length > 0}
		<h1>Search results for "{query}"</h1>
		<div class="mt-8">
			<PostsList {posts} />
		</div>
		<Pagination currentPage={1} totalPosts={data.total} basePath="/Search-results/page" />
	{:else if query}
		<h1>Not found</h1>
		<p>Sorry, there is no content matching your search criteria. Try with other keywords.</p>
	{:else}
		<p>Loading search results...</p>
	{/if}
</div>
