<script>
  import { head } from 'svelte/internal';
  import LikeAndShare from '$lib/components/LikeAndShare.svelte';
  import Comment from '$lib/components/Comment.svelte';

  export let data;

  const {
    title,
    excerpt,
    date,
    updated,
    author,
    coverImage,
    coverWidth,
    coverHeight,
    categories,
    tags
  } = data.meta;

  const { PostContent, Comment: postComment } = data;
</script>

<svelte:head>
  <!-- Be sure to add your image files and un-comment the lines below -->
  <title>{title}</title>
  <meta name="description" content="{excerpt}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="{title}" />
  <meta name="twitter:title" content="{title}" />
  <meta property="og:description" content="{excerpt}" />
  <meta name="twitter:description" content="{excerpt}" />
  <!-- <meta property="og:image" content="https://yourdomain.com/image_path" /> -->
  <meta property="og:image:width" content="{coverWidth}" />
  <meta property="og:image:height" content="{coverHeight}" />
  <!-- <meta name="twitter:image" content="https://yourdomain.com/image_path" /> -->
  <link rel="stylesheet" href="styles.css">
</svelte:head>

<article class="post">
  <!-- You might want to add an alt frontmatter attribute. If not, leaving alt blank here works, too. -->
  <img
    class="cover-image"
    src="{coverImage}"
    alt=""
    style="aspect-ratio: {coverWidth} / {coverHeight};"
    width="{coverWidth}"
    height="{coverHeight}"
  />

  <h1>{title}</h1>

  {#if categories}
    <aside class="post-header">
      <b>Posted in:</b>
      <ul>
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
  <div class="meta">
    <b>Posted by:</b> {author}
    <br>
    <b>Published:</b> {date}
    <br>
    <b>Updated:</b> {updated}
  </div>

  <LikeAndShare />

  <PostContent />

  {#if tags}
    <aside class="post-footer">
      <p>Tags: </p>
      <ul>
        {#each tags as tag}
          <li>
            <a href="/blog/tags/{tag}/">
              {tag}
            </a>
          </li>
        {/each}
      </ul>
    </aside>
  {/if}

  <Comment Comment={postComment} />
</article>
<style>
/* styles.css */
.post {
  margin: 20px;
  padding: 20px;
  background-color: #f5f5f5;
}

.cover-image {
  display: block;
  margin-bottom: 20px;
}

.post-header {
  margin-bottom: 10px;
}

.post-header ul {
  list-style-type: none;
  padding: 0;
}

.meta {
  margin-bottom: 20px;
}

.post-footer {
  margin-top: 20px;
}

.post-footer ul {
  list-style-type: none;
  padding: 0;
}

.post-footer ul li {
  display: inline;
  margin-right: 10px;
}

.post-footer ul li:last-child {
  margin-right: 0;
}
</style>