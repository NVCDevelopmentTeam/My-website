<script>
	import { formatDate } from '$lib/data/utils';
	import { postsPerPage } from '$lib/data/config';

	// State management with proper runes
	let posts = $state([]);
	let totalPosts = $state(0);
	let loading = $state(true);
	let error = $state(null);

	// Function to fetch data from API
	async function fetchPosts() {
		try {
			loading = true;
			error = null;
			
			const postRes = await fetch('/api/posts.json');
			if (!postRes.ok) {
				throw new Error(`HTTP error! status: ${postRes.status}`);
			}
			
			const data = await postRes.json();
			console.log('API response data:', data); // Debugging
			
			// Validate response structure
			if (!data || typeof data !== 'object') {
				throw new Error('Invalid response format');
			}
			
			// Update state
			if (Array.isArray(data.posts)) {
				posts = data.posts.slice(0, postsPerPage);
			} else {
				posts = [];
				if (!error) {
					error = 'No posts found in response';
				}
			}
			
			totalPosts = typeof data.total === 'number' ? data.total : 0;
			
			console.log('Posts in component:', posts); // Debugging
			console.log('Total posts:', totalPosts); // Debugging
			
		} catch (err) {
			console.error('Failed to load posts:', err);
			error = err.message || 'Failed to load posts';
			posts = [];
			totalPosts = 0;
		} finally {
			loading = false;
		}
	}

	// Use $effect to run the fetch on component initialization
	$effect(() => {
		// This runs once when the component mounts
		fetchPosts();
	});

	// Derived state for better reactivity
	let displayPosts = $derived(posts || []);
	let hasError = $derived(error !== null);
	let isEmpty = $derived(!loading && displayPosts.length === 0 && !hasError);
</script>

<section class="mb-8 w-full">
	<h2 id="latest" class="mb-6 text-2xl font-bold tracking-tight text-foreground md:text-4xl">
		Latest Posts
	</h2>
	
	{#if hasError}
		<div class="p-4 mb-4 text-red-700 bg-red-100 border border-red-300 rounded">
			<p class="font-medium">Error loading posts:</p>
			<p class="text-sm">{error}</p>
			<button 
				class="mt-2 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
				onclick={fetchPosts}
			>
				Try Again
			</button>
		</div>
	{:else}
		<ul class="space-y-4">
			{#if loading}
				<!-- Loading skeleton -->
				{#each Array(5) as _, i (i)}
					<li class="animate-pulse">
						<div class="h-4 bg-muted rounded w-3/4 mb-2"></div>
						<div class="h-3 bg-muted rounded w-1/2"></div>
					</li>
				{/each}
			{:else if isEmpty}
				<!-- Empty state -->
				<li class="py-8 text-center text-muted-foreground">
					<p>No posts available at the moment.</p>
				</li>
			{:else}
				<!-- Posts list -->
				{#each displayPosts as post (post.slug)}
					<li>
						<a class="group block" href="/blog/{post.slug}">
							<h3 class="text-lg font-medium group-hover:text-primary transition-colors">
								{post.title}
							</h3>
							<p class="text-sm text-muted-foreground">
								{formatDate(post.date)}
							</p>
						</a>
					</li>
				{/each}
			{/if}
		</ul>
	{/if}
</section>