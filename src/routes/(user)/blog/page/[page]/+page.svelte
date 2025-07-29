<!-- This file handles any /blog/page/x route for pagination -->
<script>
	import PostsList from '$lib/components/PostsList.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { postsPerPage, siteDescription } from '$lib/data/config';

	/** @type {{ data: { posts: import("$lib/data/fetchPosts").Post[], page: number, total: number } }} */
	let { data } = $props();
	const { page, total, posts } = data;

	let lowerBound = $derived(page * postsPerPage - (postsPerPage - 1) || 1);
	let upperBound = $derived(Math.min(page * postsPerPage, total));
</script>

<svelte:head>
	<title>Blog - page {page}</title>
	<meta data-key="description" name="description" content={siteDescription} />
</svelte:head>

<!-- TODO: this is duplicated across multiple `+page.svelte` files -->
{#if posts.length}
	<h1>Posts {lowerBound}–{upperBound} of {total}</h1>
	<Pagination currentPage={page} totalPosts={total} />

	<PostsList {posts} />

	<Pagination currentPage={page} totalPosts={total} />
{:else}
	<h1>Oops!</h1>

	<p>Sorry, no posts to show here.</p>

	<a href="/blog">Back to blog</a>
{/if}
