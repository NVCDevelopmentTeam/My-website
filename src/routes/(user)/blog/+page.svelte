<script>
	import PostsList from '$lib/components/PostsList.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { siteDescription, siteTitle } from '$lib/data/config';

	/** @type {{ data: import("./$types").PageData & { posts: import("$lib/data/fetchPosts").Post[], total: number } }} */
	let { data } = $props();
</script>

<svelte:head>
	<title>Blog - {siteTitle}</title>
	<meta name="description" content={siteDescription} />
	<script src="https://code.responsivevoice.org/responsivevoice.js?key=6BLD3hdr"></script>
</svelte:head>

<div class="container mx-auto px-4 py-16">
	<div class="max-w-3xl mx-auto">
		<header class="text-center mb-8">
			<h1 class="text-4xl font-bold">Blog</h1>
			<p class="text-lg text-muted-foreground mt-2">
				This is a page that shares my articles about my experiences in learning programming
			</p>
			<p class="mt-2">{siteDescription}</p>
		</header>

		<div class="mt-8">
			<PostsList posts={data.posts} />
		</div>

		<Pagination currentPage={1} totalPosts={data.total} />
	</div>
</div>
