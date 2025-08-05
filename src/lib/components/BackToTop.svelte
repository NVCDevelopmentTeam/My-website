<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let showButton = $state(false);

	onMount(() => {
		if (!browser) return;

		function handleScroll() {
			showButton = window.scrollY > 300;
		}

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function scrollToTop() {
		if (browser) {
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		}
	}
</script>

{#if showButton}
	<button
		onclick={scrollToTop}
		class="fixed bottom-20 right-4 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
		aria-label="Về đầu trang"
	>
		<i class="fas fa-arrow-up" aria-hidden="true"></i>
	</button>
{/if}
