<script>
	import { onMount, onDestroy } from 'svelte';
	import { fly } from 'svelte/transition';

	export let slides = [];

	let currentSlide = 0;
	let timer;

	function nextSlide() {
		currentSlide = (currentSlide + 1) % slides.length;
	}

	onMount(() => {
		timer = setInterval(nextSlide, 5000);
	});

	onDestroy(() => {
		clearInterval(timer);
	});
</script>

<div class="relative h-96 overflow-hidden">
	{#each slides as slide, i}
		{#if i === currentSlide}
			<div
				transition:fly={{ x: 200, duration: 500 }}
				class="absolute inset-0 flex flex-col items-center justify-center text-center bg-cover bg-center"
				style="background-image: url({slide.image})"
			>
				<div class="bg-black bg-opacity-50 p-8 rounded-lg">
					<h2 class="text-4xl font-bold text-white mb-4">{slide.title}</h2>
					<p class="text-xl text-white mb-6">{slide.subtitle}</p>
					<a
						href={slide.link}
						class="bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors"
						>{slide.cta}</a
					>
				</div>
			</div>
		{/if}
	{/each}

	<div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
		{#each slides as _, i}
			<button
				on:click={() => (currentSlide = i)}
				class:bg-white={i === currentSlide}
				class:bg-gray-400={i !== currentSlide}
				class="w-3 h-3 rounded-full"
				aria-label="Go to slide {i + 1}"
			></button>
		{/each}
	</div>
</div>
