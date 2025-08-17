<script>
	import {
		menuOpen,
		darkMode,
		contrast,
		colorFilters,
		fontSize,
		toggleDarkMode,
		toggleContrast,
		toggleColorFilters,
		increaseFontSize,
		decreaseFontSize,
		handleKeydown
	} from '$lib/utils/accessibility.js';
</script>

<div class="relative">
	<button
		onclick={() => menuOpen.set(!$menuOpen)}
		onkeydown={(e) => handleKeydown(e, () => menuOpen.set(!$menuOpen))}
		aria-expanded={$menuOpen}
		aria-controls="accessibility-options"
		class="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
	>
		<svg
			class="w-6 h-6 text-gray-600 dark:text-gray-300"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
			></path>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
			></path>
		</svg>
		<span class="sr-only">Open accessibility menu</span>
	</button>

	{#if $menuOpen}
		<div
			id="accessibility-options"
			role="menu"
			class="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20"
		>
			<div class="p-4 space-y-4">
				<h3 class="text-lg font-semibold text-gray-800 dark:text-white">Accessibility Settings</h3>

				<!-- Dark Mode -->
				<div class="flex items-center justify-between">
					<label for="dark-mode-toggle" class="text-gray-600 dark:text-gray-300">Dark Mode</label>
					<button
						id="dark-mode-toggle"
						aria-pressed={$darkMode}
						onclick={toggleDarkMode}
						onkeydown={(e) => handleKeydown(e, toggleDarkMode)}
						class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						class:bg-indigo-600={$darkMode}
						class:bg-gray-200={!$darkMode}
						aria-label="Toggle dark mode"
					>
						<span
							class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform"
							class:translate-x-6={$darkMode}
							class:translate-x-1={!$darkMode}
						></span>
					</button>
				</div>

				<!-- High Contrast -->
				<div class="flex items-center justify-between">
					<label for="contrast-toggle" class="text-gray-600 dark:text-gray-300">High Contrast</label
					>
					<button
						id="contrast-toggle"
						aria-pressed={$contrast}
						onclick={toggleContrast}
						onkeydown={(e) => handleKeydown(e, toggleContrast)}
						class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						class:bg-indigo-600={$contrast}
						class:bg-gray-200={!$contrast}
						aria-label="Toggle high contrast"
					>
						<span
							class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform"
							class:translate-x-6={$contrast}
							class:translate-x-1={!$contrast}
						></span>
					</button>
				</div>

				<!-- Color Filters -->
				<div class="flex items-center justify-between">
					<label for="color-filters-toggle" class="text-gray-600 dark:text-gray-300"
						>Color Filters</label
					>
					<button
						id="color-filters-toggle"
						aria-pressed={$colorFilters}
						onclick={toggleColorFilters}
						onkeydown={(e) => handleKeydown(e, toggleColorFilters)}
						class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						class:bg-indigo-600={$colorFilters}
						class:bg-gray-200={!$colorFilters}
						aria-label="Toggle color filters"
					>
						<span
							class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform"
							class:translate-x-6={$colorFilters}
							class:translate-x-1={!$colorFilters}
						></span>
					</button>
				</div>

				<!-- Font Size -->
				<div class="flex items-center justify-between">
					<label for="font-size-controls" class="text-gray-600 dark:text-gray-300">Font Size</label>
					<div id="font-size-controls" class="flex items-center space-x-2">
						<button
							onclick={decreaseFontSize}
							onkeydown={(e) => handleKeydown(e, decreaseFontSize)}
							aria-label="Decrease font size"
							class="p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							<span class="text-lg font-bold">-</span>
						</button>
						<span class="text-gray-800 dark:text-white">{$fontSize}px</span>
						<button
							onclick={increaseFontSize}
							onkeydown={(e) => handleKeydown(e, increaseFontSize)}
							aria-label="Increase font size"
							class="p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							<span class="text-lg font-bold">+</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<div id="mode-announcer" aria-live="assertive" class="sr-only"></div>
