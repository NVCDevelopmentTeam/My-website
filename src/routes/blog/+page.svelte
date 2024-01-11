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
<div class="flex flex-col flex-grow">
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

<style>
  h1 {
    font-size: 2.5rem;
    line-height: 1.2;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }

  h2 {
    font-size: 1.125rem;
    line-height: 1.4;
    font-weight: 500;
    margin-top: 0;
    margin-bottom: 0.5rem;
  }

  p {
    margin-top: 0.5rem;
    margin-bottom: 0;
  }

  .flex {
    display: flex;
  }

  .flex-col {
    flex-direction: column;
  }

  .flex-grow {
    flex-grow: 1;
  }

  .pt-4 {
    padding-top: 1rem;
  }

  .mt-8 {
    margin-top: 2rem;
  }

  .pt-8 {
    padding-top: 2rem;
  }

  .pb-4 {
    padding-bottom: 1rem;
  }

  .text-4xl {
    font-size: 2.25rem;
  }

  .text-5xl {
    font-size: 3rem;
  }

  .font-bold {
    font-weight: 700;
  }

  .tracking-tight {
    letter-spacing: -0.025em;
  }

  .text-lg {
    font-size: 1.125rem;
  }

  .font-medium {
    font-weight: 500;
  }

  .ml-1 {
    margin-left: 0.25rem;
  }

  .mr-1 {
    margin-right: 0.25rem;
  }

  .w-4 {
    width: 1rem;
  }

  .h-4 {
    height: 1rem;
  }

  a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    color: #a0aec0;
  }

  :global(.dark) a {
    color: #e2e8f0;
  }
</style>