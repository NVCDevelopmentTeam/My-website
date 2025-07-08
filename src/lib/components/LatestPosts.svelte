<script>
	import { onMount } from 'svelte';
	import { formatDate } from '$lib/data/utils';
	import { postsPerPage } from '$lib/data/config';

	let posts = $state([]);

	// Function to fetch data from API
	async function fetchPosts() {
		try {
			const postRes = await fetch('/api/posts.json');
			if (!postRes.ok) throw new Error('Network response was not ok');
			const posts = await postRes.json();
			console.log('Posts data:', posts); // Debugging

			const totalRes = await fetch('/api/posts/count');
			if (!totalRes.ok) throw new Error('Network response was not ok');
			const total = await totalRes.json();
			console.log('Total count data:', total); // Debugging

			return { posts, total };
		} catch (error) {
			console.error('Failed to load posts:', error);
			return { posts: [], total: 0 };
		}
	}

	// Use onMount to call the fetchPosts function when the component is mounted
	onMount(async () => {
		const response = await fetchPosts();
		posts = response.posts.slice(0, postsPerPage);
		console.log('Posts in component:', posts); // Debugging
	});
</script>

<section class="mb-8 w-full">
	<h2
		id="latest"
		class="mb-6 text-2xl font-bold tracking-tight text-black dark:text-white md:text-4xl"
	>
		Latest Posts
	</h2>
	<ul class="space-y-2">
		{#if posts.length > 0}
			{#each posts as post (post.slug)}
				<li class="post-item">
					<a class="post-title" href="/blog/{post.slug}">{post.title}</a>
					<span class="post-date">
						{formatDate(post.date)}
					</span>
				</li>
			{/each}
		{:else}
			<li class="loading">Loading...</li>
		{/if}
	</ul>
</section>
