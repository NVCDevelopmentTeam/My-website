<script>
	let query = '';

	function handleSearch() {
		// Implement search logic here
		// For example, navigate to a search page: window.location.href = `/search?q=${query}`;
	}
</script>

<div class="relative">
<form on:submit|preventDefault={handleSearch} class="relative">
	<input type="search" bind:value={query} placeholder="Search..." class="border rounded-full px-4 py-2 w-64" aria-label="Search" />
	<button type="submit" class="absolute right-2 top-1/2 -translate-y-1/2" aria-label="Submit Search">
		<!-- Search Icon -->
	</button>
</form>
</div>

