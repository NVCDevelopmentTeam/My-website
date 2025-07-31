<script>
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Search from './Search.svelte';
	import AccessibilityMenu from './AccessibilityMenu.svelte';
	import { config } from '$lib/data/config';
	import { isMenuOpen, toggleMenu } from '$lib/data/openMenu';
</script>

<header id="top" class="bg-white shadow-md p-4 flex justify-between items-center">
	<div class="flex items-center">
		<a href="/" class="flex items-center">
			<img src="/logo.png" alt="{config.title} Logo" class="h-10 mr-2" />
			<span class="font-bold text-xl">{config.title}</span>
		</a>
	</div>
	<a
		href="#main"
		class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:m-4 focus:p-4 focus:bg-white focus:shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
		>Skip to main content</a
	>

	<div class="flex items-center space-x-4">
		<AccessibilityMenu />
		<Search />
		<button on:click={toggleMenu} class="md:hidden" aria-label="Toggle Menu">
			<!-- Menu Icon -->
		</button>
	</div>

	<!-- Desktop Menu -->
	<nav class="hidden md:flex space-x-4">
		{#each config.navLinks as link}
			<a href={link.href} class="hover:text-primary">{link.title}</a>
		{/each}
	</nav>

	<!-- Mobile Menu -->
	{#if $isMenuOpen}
		<div
			transition:fly={{ y: -10, duration: 300, easing: quintOut }}
			class="absolute top-16 left-0 w-full bg-white shadow-md md:hidden"
		>
			<nav class="flex flex-col items-center space-y-4 p-4">
				{#each config.navLinks as link}
					<a href={link.href} class="hover:text-primary">{link.title}</a>
				{/each}
			</nav>
		</div>
	{/if}
</header>
