<script>
	import { accessibilityStore } from '$stores/accessibility';

	let isOpen = $state(false);

	function toggleMenu() {
		isOpen = !isOpen;
	}

	function updateSetting(key, value) {
		accessibilityStore.update((settings) => ({
			...settings,
			[key]: value
		}));
	}
</script>

<div class="relative">
	<button
		onclick={toggleMenu}
		class="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
		aria-label="Accessibility settings"
	>
		<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
			/>
		</svg>
	</button>

	{#if isOpen}
		<div
			class="absolute right-0 mt-2 w-64 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5"
		>
			<div class="p-4 space-y-4">
				<div>
					<h3 class="text-sm font-medium text-gray-900">Font Size</h3>
					<div class="mt-2 space-x-2">
						{#each ['normal', 'large', 'xl'] as size}
							<button
								class="px-3 py-1 rounded"
								class:bg-blue-500={$accessibilityStore.fontSize === size}
								class:text-white={$accessibilityStore.fontSize === size}
								onclick={() => updateSetting('fontSize', size)}
							>
								{size}
							</button>
						{/each}
					</div>
				</div>

				<div>
					<h3 class="text-sm font-medium text-gray-900">Contrast</h3>
					<div class="mt-2 space-x-2">
						{#each ['normal', 'high'] as contrast}
							<button
								class="px-3 py-1 rounded"
								class:bg-blue-500={$accessibilityStore.contrast === contrast}
								class:text-white={$accessibilityStore.contrast === contrast}
								onclick={() => updateSetting('contrast', contrast)}
							>
								{contrast}
							</button>
						{/each}
					</div>
				</div>

				<div>
					<h3 class="text-sm font-medium text-gray-900">Cursor Size</h3>
					<div class="mt-2 space-x-2">
						{#each ['normal', 'large'] as cursor}
							<button
								class="px-3 py-1 rounded"
								class:bg-blue-500={$accessibilityStore.cursor === cursor}
								class:text-white={$accessibilityStore.cursor === cursor}
								onclick={() => updateSetting('cursor', cursor)}
							>
								{cursor}
							</button>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>