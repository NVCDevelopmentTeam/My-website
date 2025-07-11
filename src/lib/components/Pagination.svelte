<script>
	import ArrowLeftIcon from '$lib/components/ArrowLeftIcon.svelte';
	import ArrowRightIcon from '$lib/components/ArrowRightIcon.svelte';
	import { postsPerPage } from '$lib/data/config';

	/**
	 * @typedef {Object} Props
	 * @property {number} [currentPage]
	 * @property {number} [totalPosts]
	 * @property {string} [basePath]
	 */

	/**
	 * @typedef {Object} Props
	 * @property {Props} [currentPage]
	 * @property {number} [totalPosts]
	 * @property {string} [basePath]
	 */

	/** @type {Props} */
	let { currentPage = 1, totalPosts = 0, basePath = '/blog/page' } = $props();

	// Calculate the number of available pages
	let pagesAvailable = Math.ceil(totalPosts / postsPerPage);

	// Determine if it's the first or last page

	let hasNextPage = currentPage < pagesAvailable;
	let hasPreviousPage = currentPage > 1;

	// Create a list of page numbers for pagination
	let pages = Array.from({ length: pagesAvailable }, (_, i) => i + 1);

	// Function to determine if the page is the current page
	const isCurrentPage = (page) => page === currentPage;
</script>

<div class="flex items-center justify-between pt-16 pb-8">
	{#if hasPreviousPage}
		<a
			href={`${basePath}/1`}
			data-sveltekit-prefetch
			class="flex items-center gap-2 font-medium text-zinc-700"
		>
			First
		</a>
		<a
			href={`${basePath}/${currentPage - 1}`}
			data-sveltekit-prefetch
			class="flex items-center gap-2 font-medium text-zinc-700"
		>
			<ArrowLeftIcon class="w-4 h-4" />
			Previous
		</a>
	{/if}

	{#if pagesAvailable > 1}
		<nav aria-label="Pagination navigation" class="pagination">
			<ul class="flex gap-2">
				{#each pages as page (page)}
					<li>
						<a
							href={`${basePath}/${page}`}
							aria-current={isCurrentPage(page) ? 'page' : undefined}
							class:active={isCurrentPage(page)}
							class="px-3 py-1 border rounded-md text-zinc-700 hover:bg-gray-200"
						>
							{page}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	{/if}

	{#if hasNextPage}
		<a
			href={`${basePath}/${currentPage + 1}`}
			data-sveltekit-prefetch
			class="flex items-center gap-2 font-medium text-zinc-700"
		>
			Next
			<ArrowRightIcon class="w-4 h-4" />
		</a>
		<a
			href={`${basePath}/${pagesAvailable}`}
			data-sveltekit-prefetch
			class="flex items-center gap-2 font-medium text-zinc-700"
		>
			Last
		</a>
	{/if}
</div>
