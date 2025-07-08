<script>
	import PostsList from '$lib/components/PostsList.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { siteDescription, siteTitle } from '$lib/data/config';

	let { data } = $props();
</script>

<svelte:head>
	<title>Blog - {siteTitle}</title>
	<meta name="description" content={siteDescription} />
	<script src="https://code.responsivevoice.org/responsivevoice.js?key=6BLD3hdr"></script>
</svelte:head>

<h1>Blog</h1>
<div class="flex flex-col">
	<header class="pt-4">
		<h2 class="text-lg font-medium">
			This is a page that shares my articles about my experiences in learning programming
		</h2>
		<p class="mt-2">{siteDescription}</p>
	</header>

	<div class="mt-8">
		<PostsList posts={data.posts} />
	</div>

	<Pagination currentPage={1} totalPosts={data.total} />
</div>
