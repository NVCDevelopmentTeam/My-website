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
  <ul class="space-y-2 text-white">
    {#if posts.length > 0}
      {#each posts as post (post.slug)}
        <li>
          <a class="font-bold" href={post.slug}>{post.title}</a>
          <span class="hidden text-xs text-black dark:text-gray-400 sm:inline">
            {new Date(post.date).toISOString().slice(0, 10)}
          </span>
        </li>
      {/each}
    {:else}
      <li>Loading...</li>
    {/if}
  </ul>
</section>