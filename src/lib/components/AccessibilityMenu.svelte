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
		setTimeout(() => (announcer.innerText = ''), 1000);
	}

	function announceMode(mode, isEnabled) {
		const announcer = document.getElementById('mode-announcer');
		announcer.innerText = `${mode} is now ${isEnabled ? 'enabled' : 'disabled'}`;
		setTimeout(() => (announcer.innerText = ''), 1000);
	}

	onMount(() => {
		darkMode.subscribe((value) => document.body.classList.toggle('dark', value));
	});

	function handleKeydown(event, action) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			action();
		}
	}
</script>

<nav aria-label="Accessibility menu" class="accessibility-menu">
	<button
		role="link"
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
		<div id="accessibility-options" role="menu">
			<button
				aria-pressed={$darkMode}
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
				aria-label="Increase font size"
				onclick={increaseFontSize}
				onkeydown={(event) => handleKeydown(event, increaseFontSize)}
			>
				Increase font size
			</button>

			<button
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
				aria-pressed={$contrast}
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
				aria-pressed={$colorFilters}
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
