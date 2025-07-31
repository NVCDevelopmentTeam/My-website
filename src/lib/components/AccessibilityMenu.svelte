<script>
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { preferences } from '$lib/utils/accessibility.js';

	let isOpen = false;

	function toggleMenu() {
		isOpen = !isOpen;
	}

	function updatePreference(key, value) {
		$preferences = { ...$preferences, [key]: value };
	}

	function resetPreferences() {
		$preferences = {};
	}
</script>

<div class="relative">
	<button on:click={toggleMenu} class="p-2 rounded-full hover:bg-gray-200" aria-label="Accessibility Menu">
		<!-- Accessibility Icon -->
	</button>

	{#if isOpen}
		<div transition:fly={{ y: -10, duration: 300, easing: quintOut }} class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-10">
			<h3 class="font-bold text-lg mb-2">Accessibility</h3>

			<div class="mb-4">
				<label class="block text-sm font-medium text-gray-700">Font Size</label>
				<div class="flex space-x-2 mt-1">
					<button on:click={() => updatePreference('font-size', '14px')} class:active={$preferences['font-size'] === '14px'}>Small</button>
					<button on:click={() => updatePreference('font-size', '16px')} class:active={$preferences['font-size'] === '16px'}>Normal</button>
					<button on:click={() => updatePreference('font-size', '18px')} class:active={$preferences['font-size'] === '18px'}>Large</button>
					<button on:click={() => updatePreference('font-size', '20px')} class:active={$preferences['font-size'] === '20px'}>Extra Large</button>
				</div>
			</div>

			<div class="flex items-center justify-between mb-4">
				<label for="high-contrast" class="text-sm font-medium text-gray-700">High Contrast</label>
				<input type="checkbox" id="high-contrast" on:change={(e) => updatePreference('high-contrast', e.target.checked)} checked={$preferences['high-contrast']} />
			</div>

			<div class="flex items-center justify-between mb-4">
				<label for="reduce-motion" class="text-sm font-medium text-gray-700">Reduce Motion</label>
				<input type="checkbox" id="reduce-motion" on:change={(e) => updatePreference('reduce-motion', e.target.checked)} checked={$preferences['reduce-motion']} />
			</div>

			<div class="border-t pt-4">
				<button on:click={resetPreferences} class="w-full text-sm text-red-600 hover:underline">Reset to Default</button>
			</div>

			<div class="mt-4">
				<h4 class="font-bold">Keyboard Shortcuts</h4>
				<ul class="text-sm list-disc list-inside">
					<li>Tab / Shift+Tab: Navigate</li>
					<li>Enter / Space: Activate</li>
					<li>Esc: Close Menu</li>
				</ul>
			</div>

			<button on:click={toggleMenu} class="mt-4 w-full text-center py-2 bg-gray-200 rounded">Close Menu</button>
		</div>
	{/if}
</div>

