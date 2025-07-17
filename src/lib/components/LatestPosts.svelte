<script>
	import { onMount } from 'svelte';
	import { formatDate } from '$lib/data/utils';
	import { postsPerPage } from '$lib/data/config';

	let posts = $state([]);
	let totalPosts = $state(0);

	// Function to fetch data from API
	async function fetchPosts() {
		try {
			const postRes = await fetch('/api/posts.json');
			if (!postRes.ok) throw new Error('Network response was not ok');
			const data = await postRes.json();
			console.log('API response data:', data); // Debugging
			return data;
		} catch (error) {
			console.error('Failed to load posts:', error);
			return { posts: [], total: 0 };
		}
	}

	// Use onMount to call the fetchPosts function when the component is mounted
	onMount(async () => {
		try {
			const response = await fetchPosts();
			if (Array.isArray(response.posts)) {
				posts = response.posts.slice(0, postsPerPage);
			} else {
				posts = [];
			}
			totalPosts = response.total;
			console.log('Posts in component:', posts); // Debugging
			console.log('Total posts:', totalPosts); // Debugging
		} catch (error) {
			console.error('Error in onMount:', error);
		}
	});
</script>

<section class="mb-8 w-full">
	<h2 id="latest" class="mb-6 text-2xl font-bold tracking-tight text-foreground md:text-4xl">
		Latest Posts
	</h2>
	<ul class="space-y-4">
		{#if posts.length > 0}
			{#each posts as post (post.slug)}
				<li>
					<a class="group" href="/blog/{post.slug}">
						<h3 class="text-lg font-medium group-hover:text-primary">{post.title}</h3>
						<p class="text-sm text-muted-foreground">{formatDate(post.date)}</p>
					</a>
				</li>
			{/each}
		{:else}
			{#each Array(5) as i (i)}
				<li class="animate-pulse">
					<div class="h-4 bg-muted rounded w-3/4 mb-2"></div>
					<div class="h-3 bg-muted rounded w-1/2"></div>
				</li>
			{/each}
		{/if}
	</ul>
</section>
