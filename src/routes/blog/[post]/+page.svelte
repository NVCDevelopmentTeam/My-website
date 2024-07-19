<script>
  import LikeAndShare from '$lib/components/LikeAndShare.svelte';
  import Comment from '$lib/components/Comment.svelte';
  export let data;

  const { title, excerpt, date, updated, author, categories, coverImage, coverWidth, coverHeight, tags } = data.meta;
  const { PostContent, comments } = data;
</script>

<svelte:head>
  <!-- Be sure to add your image files and un-comment the lines below -->
  <title>{title}</title>
  <meta data-key="description" name="description" content={excerpt} />
  <meta property="og:type" content="article" />
  <meta property="og:title" content={title} />
  <meta name="twitter:title" content={title} />
  <meta property="og:description" content={excerpt} />
  <meta name="twitter:description" content={excerpt} />
  <!-- <meta property="og:image" content="https://yourdomain.com/image_path" /> -->
  <meta property="og:image:width" content={coverWidth} />
  <meta property="og:image:height" content={coverHeight} />
  <!-- <meta name="twitter:image" content="https://yourdomain.com/image_path" /> -->
</svelte:head>

<article class="post">
  <!-- You might want to add an alt frontmatter attribute. If not, leaving alt blank here works, too. -->
  <img
    class="cover-image"
    src={coverImage}
    alt=""
    style="aspect-ratio: {coverWidth} / {coverHeight};"
    width={coverWidth}
    height={coverHeight}
  />

  <h1>{title}</h1>
  
  <div class="meta">
    <b>Posted by:</b> {author}
    <br />
    <b>Published:</b> {date}
    <br />
    <b>Updated:</b> {updated}
  </div>

  {#if categories}
    <aside class="post-header">
      <p>Posted in:</p>
      <ul class="post-header__categories">
        {#each categories as category}
          <li>
            <a href="/blog/category/{category}/">
              {category}
            </a>
          </li>
        {/each}
      </ul>
    </aside>
  {/if}
  
  <LikeAndShare />
  
  <svelte:component this={PostContent} />

  {#if tags}
    <aside class="post-footer">
      <p>Tags: </p>
      <ul class="post-footer__tags">
        {#each tags as tag}
          <li>
            <a href="/blog/tag/{tag}/">
              {tag}
            </a>
          </li>
        {/each}
      </ul>
    </aside>
  {/if}
  
  <Comment {comments} />
</article>

<style>
.post {
  margin: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cover-image {
  display: block;
  margin-bottom: 20px;
  max-width: 100%;
  border-radius: 10px;
  object-fit: cover;
}

.meta {
  margin-bottom: 20px;
  font-size: 14px;
  color: #555;
}

.post-header {
  margin-bottom: 10px;
}

.post-header__categories {
  list-style-type: none;
  padding: 0;
}

.post-header__categories li {
  display: inline;
  margin-right: 10px;
}

.post-header__categories li a {
  text-decoration: none;
  color: #007acc;
}

.post-header__categories li a:hover {
  text-decoration: underline;
}

.post-footer {
  margin-top: 20px;
}

.post-footer__tags {
  list-style-type: none;
  padding: 0;
}

.post-footer__tags li {
  display: inline;
  margin-right: 10px;
}

.post-footer__tags li a {
  text-decoration: none;
  color: #007acc;
}

.post-footer__tags li a:hover {
  text-decoration: underline;
}
</style>
