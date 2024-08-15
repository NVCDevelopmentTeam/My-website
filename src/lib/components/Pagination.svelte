<script>
  import ArrowLeftIcon from '$lib/components/ArrowLeftIcon.svelte';
  import ArrowRightIcon from '$lib/components/ArrowRightIcon.svelte';
  import { postsPerPage } from '$lib/data/config';

  export let currentPage = 1;
  export let totalPosts = 0;
  export let path = '/blog/page';

  // Calculate the number of available pages
  let pagesAvailable = Math.ceil(totalPosts / postsPerPage);

  const isCurrentPage = (page) => page === currentPage;

  let isFirstPage = currentPage === 1;
  let hasNextPage = currentPage < pagesAvailable;
  
  // Create a list of page numbers
  $: pages = Array.from({ length: pagesAvailable }, (_, i) => i + 1);
</script>

<div class="flex items-center justify-between pt-16 pb-8">
  {#if !isFirstPage}
    <a href={`${path}/${currentPage - 1}`} data-sveltekit-prefetch class="flex items-center gap-2 font-medium text-zinc-700">
      <ArrowLeftIcon class="w-4 h-4" />
      Previous
    </a>
  {/if}

  {#if pagesAvailable > 1}
    <nav aria-label="Pagination navigation" class="pagination">
      <ul class="flex gap-2">
        {#each pages as page}
          <li>
            <a href={`${path}/${page}`} aria-current={isCurrentPage(page) ? 'page' : undefined} class="px-2 py-1 border rounded">
              <span class="sr-only">
                {#if isCurrentPage(page)}
                  Current page
                {:else}
                  Go to page
                {/if}
              </span>
              {page}
            </a>
          </li>
        {/each}
      </ul>
    </nav>
  {/if}

  {#if hasNextPage}
    <a href={`${path}/${currentPage + 1}`} data-sveltekit-prefetch class="flex items-center gap-2 font-medium text-zinc-700">
      Next
      <ArrowRightIcon class="w-4 h-4" />
    </a>
  {/if}
</div>