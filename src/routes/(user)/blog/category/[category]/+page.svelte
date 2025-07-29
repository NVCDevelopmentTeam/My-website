<!-- Renders any page at /blog/category/* -->
<script>
	import PostsList from '$lib/components/PostsList.svelte';
	import Pagination from '$lib/components/Pagination.svelte';

	/** @type {{ data: { posts: import("$lib/data/fetchPosts").Post[], category: string, total: number } }} */
	let { data } = $props();

	const { posts, category, total } = data;
	const page = 1;
</script>

<svelte:head>
	<title>Category: {category}</title>
</svelte:head>

<h1>Blog category: {category}</h1>

{#if posts.length}
	<PostsList {posts} />
	<Pagination currentPage={1} totalPosts={total} path="/blog/category/{category}/page" />
{:else}
	<p><strong>Ope!</strong> Sorry, couldn't find any posts in the category "{category}".</p>

	<p><a href="/blog">Back to blog</a></p>
{/if}
