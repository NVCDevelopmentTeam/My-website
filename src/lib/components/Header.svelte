<!-- @migration-task Error while migrating Svelte code: Unterminated string constant
https://svelte.dev/e/js_parse_error -->
<!-- @migration-task Error while migrating Svelte code: Unterminated string constant
https://svelte.dev/e/js_parse_error -->
<script>
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Search from './Search.svelte';
	import AccessibilityMenu from './AccessibilityMenu.svelte';
	import AccessibilityProvider from './AccessibilityProvider.svelte';
	import { config } from '$lib/data/config';
	import logo from '$lib/images/logo.png';
	import { Menu } from 'lucide-svelte';

	let { navMenu = 'Menu' } = $props();

	let expanded = $state(false);
	let menuButtonRef = $state(null);
	let navRef = $state(null);

	function handleClickOutside(event) {
		if (
			expanded &&
			navRef &&
			!navRef.contains(event.target) &&
			menuButtonRef &&
			!menuButtonRef.contains(event.target)
		) {
			expanded = false;
		}
	}

	function toggleMenu() {
		expanded = !expanded;
	}

	afterNavigate(() => {
		expanded = false;
	});

	function handleKeydown(event) {
		if (event.key === 'Escape' && expanded) {
			expanded = false;
			if (menuButtonRef) {
				menuButtonRef.focus();
			}
		}
	}
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleKeydown} />

<header id="top" class="bg-white shadow-md p-4 flex justify-between items-center">
	<div class="flex items-center">
		<a href="/" class="flex items-center">
			<img src={logo} alt="{config.title} Logo" class="h-10 mr-2" />
			<span class="font-bold text-xl">{config.title}</span>
		</a>
	</div>
	<div class="flex items-center space-x-4">
		<AccessibilityProvider />
		<AccessibilityMenu />
		<Search />
		<div class="relative">
			<button
				bind:this={menuButtonRef}
				onclick={toggleMenu}
				class="p-2 rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
				aria-label="Toggle navigation menu"
				aria-expanded={expanded}
				aria-controls="nav-menu"
			>
				<Menu class="w-6 h-6" />
			</button>
			{#if expanded}
				<nav
					bind:this={navRef}
					id="nav-menu"
					class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
					transition:fly={{ y: -10, duration: 200, easing: quintOut }}
				>
					<ul class="py-1">
						{#each config.navLinks as link}
							<li>
								<a
									href={link.href}
									class="block px-4 py-2 text-foreground hover:bg-muted"
									class:bg-muted={page.url.pathname === link.href}
								>
									{link.title}
								</a>
							</li>
						{/each}
					</ul>
				</nav>
			{/if}
		</div>
	</div>
</header>
