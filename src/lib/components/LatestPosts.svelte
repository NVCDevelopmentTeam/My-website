<script>
	import { formatDate } from '$lib/data/utils';
	import { postsPerPage } from '$lib/data/config';
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';

	// State management
	let posts = $state([]);
	let loading = $state(true);
	let error = $state(null);
	let retryCount = $state(0);
	let controller = $state(null);

	// Cache configuration
	const CACHE_KEY = 'latest-posts-cache';
	const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

	// Function to fetch data from the API
	async function fetchPosts(useCache = true) {
		if (!browser) {
			loading = false;
			return;
		}

		// Cancel any existing request
		controller?.abort();
		controller = new AbortController();

		try {
			loading = true;
			error = null;

			// Check cache first
			if (useCache) {
				const cached = sessionStorage.getItem(CACHE_KEY);
				if (cached) {
					const { data: cachedData, timestamp } = JSON.parse(cached);
					if (Date.now() - timestamp < CACHE_TTL) {
						posts = cachedData.posts || [];
						loading = false;
						return;
					}
				}
			}

			// Set a timeout for the fetch request
			const timeoutId = setTimeout(() => controller?.abort(), 10000); // 10-second timeout

			const postRes = await fetch('/api/posts.json', {
				signal: controller.signal,
				headers: { 'Cache-Control': 'no-cache' }
			});

			clearTimeout(timeoutId);

			if (!postRes.ok) {
				throw new Error(`HTTP error! status: ${postRes.status}`);
			}

			const data = await postRes.json();

			// Validate the structure of the response data
			if (!data || !Array.isArray(data.posts)) {
				throw new Error('Invalid response format from server.');
			}
			
			// Update cache with fresh data
			sessionStorage.setItem(CACHE_KEY, JSON.stringify({
				data,
				timestamp: Date.now()
			}));

			posts = data.posts.slice(0, postsPerPage);
			retryCount = 0; // Reset retry count on success

		} catch (err) {
			if (err.name === 'AbortError') {
				console.log('Fetch request was aborted.');
			} else {
				error = err.message || 'Failed to load posts.';
				console.error('Failed to load posts:', err);
				
				// Retry with exponential backoff
				if (retryCount < 3) {
					retryCount++;
					const backoffTime = Math.min(1000 * Math.pow(2, retryCount), 8000);
					setTimeout(() => fetchPosts(false), backoffTime);
				}
			}
		} finally {
			loading = false;
			controller = null;
		}
	}

	// Fetch posts when the component mounts
	onMount(() => {
		fetchPosts();
	});

	// Abort fetch if the component is destroyed
	onDestroy(() => {
		controller?.abort();
	});

	// Derived state for the template
	let displayPosts = $derived(posts || []);
	let hasError = $derived(error !== null);
	let isEmpty = $derived(!loading && displayPosts.length === 0 && !hasError);
</script>

<section class="mb-8 w-full">
	<div class="flex justify-between items-center mb-6">
		<h2 id="latest" class="text-2xl font-bold tracking-tight text-foreground md:text-4xl">
			Latest Posts
		</h2>
	</div>
	
	{#if hasError}
		<div class="p-4 mb-4 text-red-700 bg-red-100 border border-red-300 rounded">
			<p class="font-medium">Error loading posts:</p>
			<p class="text-sm">{error}</p>
			<div class="mt-2 space-x-2">
				<button
					class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
					onclick={() => fetchPosts(false)}
					disabled={loading}
				>
					{loading ? 'Retrying...' : 'Try Again'}
				</button>
				<button
					class="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
					onclick={() => {
						sessionStorage.removeItem(CACHE_KEY);
						fetchPosts(false);
					}}
					disabled={loading}
				>
					Clear Cache & Retry
				</button>
			</div>
		</div>
	{:else}
		<ul class="space-y-4">
			{#if loading}
				{#each Array(5) as _, i (i)}
					<li class="animate-pulse">
						<div class="h-4 bg-muted rounded w-3/4 mb-2"></div>
						<div class="h-3 bg-muted rounded w-1/2"></div>
					</li>
				{/each}
			{:else if isEmpty}
				<li class="py-8 text-center text-muted-foreground">
					<p>No posts available at the moment.</p>
					<button
						class="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
						onclick={() => fetchPosts(false)}
					>
						Refresh Posts
					</button>
				</li>
			{:else}
				{#each displayPosts as post, index (post.slug || index)}
					<li>
						<a class="group block" href="/blog/{post.slug}">
							<h3 class="text-lg font-medium group-hover:text-primary transition-colors">
								{post.title || 'Untitled Post'}
							</h3>
							<p class="text-sm text-muted-foreground">
								{post.date ? formatDate(post.date) : 'No date'}
							</p>
						</a>
					</li>
				{/each}
			{/if}
		</ul>
	{/if}
</section>