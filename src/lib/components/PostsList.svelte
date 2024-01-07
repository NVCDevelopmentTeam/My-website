<script>
	export let posts = []
</script>


<ul class="posts-list">
	{#each posts as post}
		<li>
			<article>
				<a href="/blog/{post.slug}">
					<img
					src={post.coverImage}
					alt=""
					width={post.coverWidth}
					height={post.coverHeight}
					style="ratio: {post.coverWidth} / {post.coverHeight}"
					/>
					<h2>
						{post.title}
					</h2>
				</a>
			</article>

			<p>{post.excerpt}</p>
		</li>
	{/each}
</ul>
<style>
.posts-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.posts-list li {
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
}

.posts-list li article {
  display: flex;
  flex-direction: column;
}

.posts-list li article a {
  text-decoration: none;
  color: #333;
}

.posts-list li article a:hover {
  text-decoration: underline;
}

.posts-list li article img {
  width: 100%;
  height: auto;
  object-fit: cover;
  margin-bottom: 1rem;
}

.posts-list li article h2 {
  font-size: 1.5rem;
  margin: 0;
}

.posts-list li p {
  margin: 0;
}
</style>