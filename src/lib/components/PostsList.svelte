<script>
	import { formatDate } from '$lib/data/utils';

	/**
	 * @typedef {import('../types/global.d.ts').FormattedPostWithPreview} FormattedPostWithPreview
	 * @property {FormattedPostWithPreview[]} [posts]
	 */

	/** @type {{posts: FormattedPostWithPreview[]}} */
	let { posts = [] } = $props();

	// A reactive boolean that's true if the posts array is not empty.
	let hasPosts = $derived(posts.length > 0);

	function setInnerHTML(node, html) {
		node.innerHTML = html;
		return {
			update(html) {
				node.innerHTML = html;
			}
		};
	}
</script>

{#if hasPosts}
	<ul class="grid gap-8">
		{#each posts as post (post.slug)}
			<li class="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden">
				<article>
					<a href={`/blog/${post.slug}`} class="block">
						{#if post.coverImage}
							<img
								class="w-full h-48 object-cover"
								src={post.coverImage}
								alt={post.title}
								width={post.coverWidth || '100%'}
								height={post.coverHeight || 'auto'}
								style:aspect-ratio={post.coverWidth && post.coverHeight
									? `${post.coverWidth} / ${post.coverHeight}`
									: 'auto'}
							/>
						{/if}
						<div class="p-6">
							<h2 class="text-2xl font-bold mb-2">{post.title}</h2>

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
												<span
													class="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
												>
													{category}
												</span>
											</li>
										{/each}
									</ul>
								</aside>
							{/if}

							{#if post.preview?.html}
								<div
									class="prose dark:prose-invert mt-4"
									use:setInnerHTML={post.preview.html}
								></div>
							{/if}
						</div>
					</a>
				</article>
			</li>
		{/each}
	</ul>
{:else}
	<p>No posts found.</p>
{/if}
