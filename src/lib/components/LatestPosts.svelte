<script>
  import { onMount } from 'svelte';
  import {postsPerPage} from '$lib/data/config';
  let posts = [];
  onMount(async () => {
    posts = await fetchPosts();
  });
  export let data;
  load(async ({ fetch, session }) => {
    const url = new URL(session.page.url);
    const postRes = await fetch(`${url.origin}/api/posts.json`);
    const posts = await postRes.json();
    const totalRes = await fetch(`${url.origin}/api/posts/count`);
    const total = await totalRes.json();
    return { posts, total };
  });
  }}
}
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