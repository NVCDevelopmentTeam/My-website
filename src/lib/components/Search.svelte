<script>
import error.mp3, no-results.mp3, search-results.mp3, start-search.mp3 from "$lib/sounds";
?? add sounds and voice search Like Google Search
	import { preventDefault } from 'svelte/legacy';

	import {
		searchQuery,
		searchResults,
		isLoading,
		noResults,
		totalResults,
		searchFilters
	} from '$lib/data/search.js';
	let query = $state('');

	function handleSearch() {
		// Implement search logic here
		// For example, navigate to a search page: window.location.href = `/search?q=${query}`;
	}
</script>

<div class="relative">
	<form onsubmit={preventDefault(handleSearch)} class="relative">
		<input
			type="search"
			bind:value={query}
			placeholder="Search..."
			class="border rounded-full px-4 py-2 w-64"
			aria-label="Search"
		/>
<Add voice search feature>
		<button
			type="submit"
			class="absolute right-2 top-1/2 -translate-y-1/2"
			aria-label="Submit Search"
		>
			<!-- Search Icon -->
		</button>
	</form>
</div>
