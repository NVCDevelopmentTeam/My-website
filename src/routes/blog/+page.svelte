<script>
  import ArrowLeftIcon from '$lib/components/ArrowLeftIcon.svelte';
  import ArrowRightIcon from '$lib/components/ArrowRightIcon.svelte';
  import PostsList from '$lib/components/PostsList.svelte';
  import Pagination from '$lib/components/Pagination.svelte';
  import { siteDescription } from '$lib/data/config';

  /** @type {import('./$types').PageData} */
  export let data;

  let isFirstPage = data.page === 1;
  let hasNextPage = data.posts[data.posts.length - 1]?.previous;
</script>

<svelte:head>
  <title>Blog</title>
  <meta data-key="description" name="description" content={siteDescription} />
</svelte:head>

<h1 class="text-4xl font-bold tracking-tight sm:text-5xl">Blog</h1>
<div class="flex flex-col">
  <header class="pt-4">
    <h2 class="text-lg font-medium">This is a page that shares my articles about my experiences in learning programming</h2>
    <p class="mt-2">{siteDescription}</p>
  </header>

  <div class="mt-8">
    <PostsList posts={data.posts} />
  </div>

  <Pagination currentPage={1} totalPosts={data.total} />

  <div class="flex items-center justify-between pt-8 pb-4">
    {#if !isFirstPage}
      <a href={`/posts/${data.page - 1}`} data-sveltekit-prefetch class="flex items-center">
        <ArrowLeftIcon class="w-4 h-4" />
        <span class="ml-1">Previous</span>
      </a>
    {:else}
      <div />
    {/if}

    {#if hasNextPage}
      <a href={`/posts/${data.page + 1}`} data-sveltekit-prefetch class="flex items-center">
        <span class="mr-1">Next</span>
        <ArrowRightIcon class="w-4 h-4" />
      </a>
    {/if}
  </div>
</div>