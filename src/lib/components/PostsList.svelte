<script>
	import { formatDate } from '$lib/data/utils';
	let { posts = [] } = $props();

	// Check input
	let hasPosts = $derived(posts.length > 0);
</script>

{#if hasPosts}
	<ul class="grid gap-8">
		{#each posts as post (post.slug)}
			<li class="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden">
				<article>
					<a href={`/blog/${post.slug}`}>
						{#if post.coverImage}
							<img
								class="w-full h-48 object-cover"
								src={post.coverImage}
								alt={post.title}
								width={post.coverWidth || '100%'}
								height={post.coverHeight || 'auto'}
								style="aspect-ratio: {post.coverWidth} / {post.coverHeight};"
							/>
						{/if}
						<div class="p-6">
							<h2 class="text-2xl font-bold mb-2">{post.title}</h2>
						</div>
					</a>
					<div class="p-6 pt-0">
						{#if post.author}
							<p class="text-sm text-muted-foreground mb-2">Posted by: {post.author}</p>
						{/if}
						{#if post.date}
							<p class="text-sm text-muted-foreground mb-2">
								Published on: {formatDate(post.date)}
							</p>
						{/if}
						<span class="text-sm text-muted-foreground">{post.readingTime}</span>
						{#if post.categories && post.categories.length > 0}
							<aside class="mt-4">
								<p class="text-sm font-medium mb-2">Posted in:</p>
								<ul class="flex flex-wrap gap-2">
									{#each post.categories as category (category)}
										<li>
											<a
												href={`/blog/category/${category}/`}
												class="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-1 rounded-md text-sm"
											>
												{category}
											</a>
										</li>
									{/each}
								</ul>
							</aside>
						{/if}
						{#if post.preview}
							<div class="prose dark:prose-invert mt-4">
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								{@html post.preview.html}
							</div>
						{/if}
					</div>
				</article>
			</li>
		{/each}
	</ul>
{:else}
	<p>No posts found.</p>
{/if}
