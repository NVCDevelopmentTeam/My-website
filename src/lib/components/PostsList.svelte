<script>
	import { formatDate } from '$lib/data/utils';
	let { posts = [] } = $props();

	// Check input
	let hasPosts = $derived(posts.length > 0);
</script>

{#if hasPosts}
	<ul class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
		{#each posts as post}
			<li class="rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
				<article class="h-full flex flex-col">
					<a href={`/blog/${post.slug}`} class="flex-grow">
						{#if post.coverImage}
							<img
								src={post.coverImage}
								alt={post.title}
								width={post.coverWidth || '100%'}
								height={post.coverHeight || 'auto'}
								style="aspect-ratio: {post.coverWidth} / {post.coverHeight};"
								class="w-full h-48 object-cover rounded-t-lg"
							/>
						{/if}
						<h2 class="text-xl font-bold mb-2 px-4 pt-4 hover:text-blue-600">{post.title}</h2>
					</a>
					{#if post.author}
						<p class="text-sm text-gray-600 px-4">Posted by: {post.author}</p>
					{/if}
					{#if post.date}
						<p class="text-sm text-gray-600 px-4">Published on: {formatDate(post.date)}</p>
					{/if}
					<span class="text-sm text-gray-500 px-4">{post.readingTime}</span>
					{#if post.categories && post.categories.length > 0}
						<aside class="px-4 py-2">
							<p class="text-sm text-gray-600">Posted in:</p>
							<ul class="flex flex-wrap gap-2 mt-1">
								{#each post.categories as category}
									<li>
										<a
											href={`/blog/category/${category}/`}
											class="text-sm bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full"
										>
											{category}
										</a>
									</li>
								{/each}
							</ul>
						</aside>
					{/if}
					{#if post.preview}
						<div class="px-4 pb-4 prose prose-sm">
							{@html post.preview.html}
						</div>
					{/if}
				</article>
			</li>
		{/each}
	</ul>
{:else}
	<p class="text-center text-gray-600 py-8">No posts found.</p>
{/if}
