<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let darkMode = writable(false);
	let fontSize = writable(16);
	let contrast = writable(false);
	let colorFilters = writable(false);
	let menuOpen = writable(false);

	function toggleDarkMode() {
		darkMode.update((value) => {
			document.body.classList.toggle('dark', !value);
			announceMode('Dark mode', !value);
			return !value;
		});
	}

	function increaseFontSize() {
		fontSize.update((size) => {
			document.documentElement.style.fontSize = `${size + 2}px`;
			announceFontSize(size + 2);
			return size + 2;
		});
	}

	function decreaseFontSize() {
		fontSize.update((size) => {
			document.documentElement.style.fontSize = `${size - 2}px`;
			announceFontSize(size - 2);
			return size - 2;
		});
	}

	function toggleContrast() {
		contrast.update((value) => {
			document.body.classList.toggle('high-contrast', !value);
			announceMode('High contrast mode', !value);
			return !value;
		});
	}

	function toggleColorFilters() {
		colorFilters.update((value) => {
			document.body.classList.toggle('color-filters', !value);
			announceMode('Color filters', !value);
			return !value;
		});
	}

	function announceFontSize(size) {
		const announcer = document.getElementById('font-size-announcer');
		announcer.innerText = `Font size is now ${size}px`;
		setTimeout(() => (announcer.innerText = ''), 3000);
	}

	function announceMode(mode, isEnabled) {
		const announcer = document.getElementById('mode-announcer');
		announcer.innerText = `${mode} is now ${isEnabled ? 'enabled' : 'disabled'}`;
		setTimeout(() => (announcer.innerText = ''), 3000);
	}

	onMount(() => {
		darkMode.subscribe((value) => document.body.classList.toggle('dark', value));
		fontSize.subscribe((value) => (document.documentElement.style.fontSize = `${value}px`));
		contrast.subscribe((value) => document.body.classList.toggle('high-contrast', value));
		colorFilters.subscribe((value) => document.body.classList.toggle('color-filters', value));
	});

	function handleKeydown(event, action) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			action();
		}
	}
</script>

<nav aria-label="Accessibility menu" class="relative inline-block text-right">
	<button
		class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
		aria-expanded={$menuOpen}
		aria-controls="accessibility-options"
		onclick={() => menuOpen.set(!$menuOpen)}
		onkeydown={(event) => handleKeydown(event, () => menuOpen.set(!$menuOpen))}
	>
		{#if $menuOpen}
			Close accessibility menu
		{:else}
			Open accessibility menu
		{/if}
	</button>

	{#if $menuOpen}
		<div
			id="accessibility-options"
			role="menu"
			class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
		>
			<button
				class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
				role="menuitemcheckbox"
				aria-checked={$darkMode}
				aria-label="Toggle dark mode"
				onclick={toggleDarkMode}
				onkeydown={(event) => handleKeydown(event, toggleDarkMode)}
			>
				{#if $darkMode}
					Go light
				{:else}
					Go dark
				{/if}
			</button>

			<button
				class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
				role="menuitem"
				aria-label="Increase font size"
				onclick={increaseFontSize}
				onkeydown={(event) => handleKeydown(event, increaseFontSize)}
			>
				Increase font size
			</button>

			<button
				class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
				role="menuitem"
				aria-label="Decrease font size"
				onclick={decreaseFontSize}
				onkeydown={(event) => handleKeydown(event, decreaseFontSize)}
			>
				Decrease font size
			</button>

			<p style="font-size: {$fontSize + 'px'}">Font size is: {$fontSize}</p>
			<div
				id="font-size-announcer"
				aria-live="assertive"
				style="position: absolute; left: -9999px;"
			></div>
			<div
				id="mode-announcer"
				aria-live="assertive"
				style="position: absolute; left: -9999px;"
			></div>

			<button
				class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
				role="menuitemcheckbox"
				aria-checked={$contrast}
				aria-label="Toggle contrast"
				onclick={toggleContrast}
				onkeydown={(event) => handleKeydown(event, toggleContrast)}
			>
				{#if $contrast}
					Low contrast
				{:else}
					High contrast
				{/if}
			</button>

			<button
				class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
				role="menuitemcheckbox"
				aria-checked={$colorFilters}
				aria-label="Toggle color filters"
				onclick={toggleColorFilters}
				onkeydown={(event) => handleKeydown(event, toggleColorFilters)}
			>
				{#if $colorFilters}
					Default filters
				{:else}
					Change filters
				{/if}
			</button>
		</div>
	{/if}
</nav>
