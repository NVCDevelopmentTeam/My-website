<script>
	import { onMount } from 'svelte';
	import {
		initializeAccessibility,
		setupSkipLinks,
		createLiveRegion
	} from '$lib/utils/accessibility.js';
	import { browser } from '$app/environment';

	onMount(() => {
		if (browser) {
			initializeAccessibility();
			setupSkipLinks();
			createLiveRegion();

			document.body.classList.add('accessibility-enabled');
			document.addEventListener('keydown', handleGlobalKeydown);

			return () => {
				document.removeEventListener('keydown', handleGlobalKeydown);
			};
		}
	});

	function handleGlobalKeydown(event) {
		if (event.altKey) {
			switch (event.key) {
				case '1': // Alt + 1: Focus main content
					event.preventDefault();
					focusElement('main');
					break;
				case '2': // Alt + 2: Focus navigation
					event.preventDefault();
					focusElement('nav', true);
					break;
				case '3': // Alt + 3: Focus search
					event.preventDefault();
					focusElement('search');
					break;
				case '0': // Alt + 0: Show accessibility help
					event.preventDefault();
					showAccessibilityHelp();
					break;
			}
		}
	}

	function focusElement(id, focusFirstLink = false) {
		const element = document.getElementById(id);
		if (element) {
			if (focusFirstLink) {
				const firstLink = element.querySelector('a, button');
				if (firstLink) {
					firstLink.focus();
				}
			} else {
				element.focus();
			}
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}

	function showAccessibilityHelp() {
		const helpText = `
Keyboard Shortcuts:
- Alt + 1: Jump to main content
- Alt + 2: Jump to navigation
- Alt + 3: Jump to search
- Alt + 0: Show this help
- Tab: Navigate forward
- Shift + Tab: Navigate backward
- Enter/Space: Activate buttons and links
- Escape: Close dialogs and menus
		`.trim();

		alert(helpText);
	}
</script>

<svelte:head>
	<style>
		/* High contrast mode */
		.high-contrast {
			--background: #000000;
			--foreground: #ffffff;
			--primary: #ffff00;
			--secondary: #00ffff;
			--muted: #333333;
			--border: #ffffff;
		}

		/* Reduced motion */
		@media (prefers-reduced-motion: reduce) {
			*,
			*::before,
			*::after {
				animation-duration: 0.01ms !important;
				animation-iteration-count: 1 !important;
				transition-duration: 0.01ms !important;
				scroll-behavior: auto !important;
			}
		}

		/* Screen reader only */
		.sr-only {
			position: absolute;
			width: 1px;
			height: 1px;
			padding: 0;
			margin: -1px;
			overflow: hidden;
			clip: rect(0, 0, 0, 0);
			white-space: nowrap;
			border: 0;
		}

		.sr-only:focus {
			position: static;
			width: auto;
			height: auto;
			padding: 0;
			margin: inherit;
			overflow: visible;
			clip: auto;
			white-space: normal;
		}
	</style>
</svelte:head>

<!-- Live region for announcements -->
<div id="live-region" aria-live="polite" aria-atomic="true" class="sr-only"></div>

<slot />

<!-- Accessibility toolbar (hidden by default, shown on focus-within) -->
<div
	class="sr-only focus-within:not-sr-only fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50"
>
	<h3 class="text-sm font-bold mb-2 text-gray-800 dark:text-white">Accessibility Shortcuts</h3>
	<div class="space-y-2">
		<button
			class="block w-full text-left text-sm px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
			onclick={() => focusElement('main')}
		>
			Jump to Main Content (Alt+1)
		</button>
		<button
			class="block w-full text-left text-sm px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
			onclick={() => focusElement('nav', true)}
		>
			Jump to Navigation (Alt+2)
		</button>
		<button
			class="block w-full text-left text-sm px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
			onclick={() => focusElement('search')}
		>
			Jump to Search (Alt+3)
		</button>
		<button
			class="block w-full text-left text-sm px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
			onclick={showAccessibilityHelp}
		>
			Show Help (Alt+0)
		</button>
	</div>
</div>
