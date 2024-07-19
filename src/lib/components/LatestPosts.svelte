<script>
  import { onMount } from 'svelte';
  import { postsPerPage } from '$lib/data/config';

  let posts = [];

  // Function to fetch data from API
  async function fetchPosts() {
    try {
      const postRes = await fetch('/api/posts.json');
      const posts = await postRes.json();

      const totalRes = await fetch('/api/posts/count');
      const total = await totalRes.json();

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
  });
</script>

<section class="mb-8 w-full">
  <h3 id="latest" class="mb-6 text-2xl font-bold tracking-tight text-black dark:text-white md:text-4xl">
    Latest Posts
  </h3>
  <ul class="space-y-2">
    {#if posts.length > 0}
      {#each posts as post (post.slug)}
        <li class="post-item">
          <a class="post-title" href="/blog/{post.slug}">{post.title}</a>
          <span class="post-date">
            {new Date(post.date).toISOString().slice(0, 10)}
          </span>
        </li>
      {/each}
    {:else}
      <li class="loading">Loading...</li>
    {/if}
  </ul>
</section>

<style>
  section {
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  h3 {
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  .post-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 5px;
    transition: background 0.3s ease;
  }

  .post-item:hover {
    background: #f1f5f9;
  }

  .post-title {
    font-weight: bold;
    color: #2d3748;
    text-decoration: none;
    font-size: 1.125rem;
  }

  .post-title:hover {
    text-decoration: underline;
  }

  .post-date {
    color: #718096;
    font-size: 0.875rem;
  }

  .loading {
    text-align: center;
    padding: 20px;
    font-size: 1.125rem;
    color: #718096;
  }
</style>
