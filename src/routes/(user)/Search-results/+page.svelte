<script>
	import { page } from '$app/stores';
	import { siteTitle } from '$lib/data/config';
	import Pagination from '$lib/components/Pagination.svelte';
	import PostsList from '$lib/components/PostsList.svelte';

	/** @type {{ data: { results: import("$lib/data/fetchPosts").Post[], total: number, error: string } }} */
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

<div class="container mx-auto px-4 py-16">
	{#if error}
		<p class="text-destructive text-center">{error}</p>
	{:else if posts.length > 0}
		<h1 class="text-4xl font-bold text-center mb-8">Search results for "{query}"</h1>
		<div class="mt-8">
			<PostsList {posts} />
		</div>
		<Pagination currentPage={1} totalPosts={data.total} path="/Search-results/page" />
	{:else if query}
		<h1 class="text-4xl font-bold text-center mb-8">Not found</h1>
		<p class="text-lg text-center text-muted-foreground">
			Sorry, there is no content matching your search criteria. Try with other keywords.
		</p>
	{:else}
		<p class="text-lg text-center text-muted-foreground">Loading search results...</p>
	{/if}
</div>
