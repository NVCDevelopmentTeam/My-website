<!-- Renders any page at /blog/tag/* -->
<script>
	import PostsList from '$lib/components/PostsList.svelte';
	import Pagination from '$lib/components/Pagination.svelte';

	/** @type {{ data: import("./$types").PageData }} */
	let { data } = $props();

	const { posts, tag, total } = data;
</script>

<svelte:head>
	<title>tag: {tag}</title>
</svelte:head>

<h1>Blog tag: {tag}</h1>

{#if posts.length}
	<PostsList {posts} />
	<Pagination totalPosts={total} path="/blog/tag/{tag}/page" />
{:else}
	<p><strong>Ope!</strong> Sorry, couldn't find any posts in the tag "{tag}".</p>

	<p><a href="/blog">Back to blog</a></p>
{/if}
