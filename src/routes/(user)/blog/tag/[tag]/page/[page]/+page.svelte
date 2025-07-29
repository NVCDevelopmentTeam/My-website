<!-- Renders posts listed by tag -->
<script>
	import PostsList from '$lib/components/PostsList.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { siteDescription, postsPerPage } from '$lib/data/config';

	/** @type {{ data: { posts: import("$lib/data/fetchPosts").Post[], tag: string, total: number, page: number } }} */
	let { data } = $props();
	const { page, tag, total, posts } = data;

	let lowerBound = $derived(page * postsPerPage - (postsPerPage - 1) || 1);
	let upperBound = $derived(Math.min(page * postsPerPage, total));
</script>

<svelte:head>
	<title>Blog tag {tag} - page {page}</title>
	<meta data-key="description" name={siteDescription} />
</svelte:head>

<!-- TODO: this is duplicated across multiple `+page.svelte` files -->
{#if posts && posts.length}
	<h1>
		Tag: {tag}
		<br />
		<small>Posts {lowerBound}–{upperBound} of {total}</small>
	</h1>
	<Pagination currentPage={page} totalPosts={total} path="/blog/tag/{tag}/page" />

	<PostsList {posts} />

	<Pagination currentPage={page} totalPosts={total} path="/blog/tag/{tag}/page" />
{:else}
	<h1>Oops!</h1>

	<p>Sorry, no posts to show here.</p>

	<a href="/blog">Back to blog</a>
{/if}
