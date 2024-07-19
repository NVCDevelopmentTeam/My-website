<!-- Renders any page at /blog/tag/* -->
<script>
	import PostsList from '$lib/components/PostsList.svelte'
	import Pagination from '$lib/components/Pagination.svelte'
  import { postsPerPage } from '$lib/data/config'

	export let data

  const { page, posts, tag, total } = data

	$: lowerBound = (page * postsPerPage) - (postsPerPage - 1) || 1
	$: upperBound = Math.min(page * postsPerPage, total)
</script>


<svelte:head>
	<title>tag: {tag}</title>
</svelte:head>


<h1>Blog tag: {tag}</h1>

{#if posts.length}
	<PostsList posts={posts} />
	<Pagination currentPage={page} totalPosts={total} path="/blog/tag/{tag}/page" />
{:else}
	<p><strong>Ope!</strong> Sorry, couldn't find any posts in the tag "{tag}".</p>

	<p><a href="/blog">Back to blog</a></p>
{/if}