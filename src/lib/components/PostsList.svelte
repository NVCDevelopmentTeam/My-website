<script>
	import { formatDate } from '$lib/data/utils';
	let { posts = [] } = $props();

	// Check input
	let hasPosts = $derived(posts.length > 0);
</script>

{#if hasPosts}
	<ul class="posts-list">
		{#each posts as post}
			<li class="posts-list__item">
				<article>
					<a href={`/blog/${post.slug}`}>
						{#if post.coverImage}
							<img
								src={post.coverImage}
								alt={post.title}
								width={post.coverWidth || '100%'}
								height={post.coverHeight || 'auto'}
								style="aspect-ratio: {post.coverWidth} / {post.coverHeight};"
							/>
						{/if}
						<h2>{post.title}</h2>
					</a>
					{#if post.author}
						<p>Posted by: {post.author}</p>
					{/if}
					{#if post.date}
						<p>Published on: {formatDate(post.date)}</p>
					{/if}
					<span>{post.readingTime}</span>
					{#if post.categories && post.categories.length > 0}
						<aside class="post-header">
							<p>Posted in:</p>
							<ul class="post-header__categories">
								{#each post.categories as category}
									<li>
										<a href={`/blog/category/${category}/`}>
											{category}
										</a>
									</li>
								{/each}
							</ul>
						</aside>
					{/if}
					{#if post.preview}
						<div class="description">
							{@html post.preview.html}
						</div>
					{/if}
				</article>
			</li>
		{/each}
	</ul>
{:else}
	<p>No posts found.</p>
{/if}
