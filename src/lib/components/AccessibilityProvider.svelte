<script>
	import { onMount } from 'svelte';
	import {
		initializeAccessibility,
		setupSkipLinks,
		createLiveRegion
	} from '$lib/utils/accessibility.js';
	import { browser } from '$app/environment';
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();

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
				case '1': // Alt + 1: Focus search
					event.preventDefault();
					focusElement('search');
					break;
				case '2': // Alt + 2: Focus main Navigation
					event.preventDefault();
					focusElement('nav', true);
					break;
				case '3': // Alt + 3: Focus main Content
					event.preventDefault();
					focusElement('main');
					break;
				case '4': // Alt + 4: Focus footer
					event.preventDefault();
					focusElement('footer');
					break;
				case '0': // Alt + 0: showAccessibilityHelp
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
- Alt + 1: skip to Search 
- Alt + 2: Skip to main navigation
- Alt + 3: Skip to main Content 
- Alt + 4: Skip to footer
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

{@render children?.()}

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
			Skip to Search (Alt+1)
		</button>
		<button
			class="block w-full text-left text-sm px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
			onclick={() => focusElement('nav', true)}
		>
			Skip to Main Navigation (Alt+2)
		</button>
		<button
			class="block w-full text-left text-sm px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
			onclick={() => focusElement('search')}
		>
			Skip to Main Content (Alt+3)
		</button>
		<button
			class="block w-full text-left text-sm px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
			onclick={showAccessibilityHelp}
		>
			Skip to footer (Alt+4)
		</button>
	</div>
	<button
		class="block w-full text-left text-sm px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
		onclick={showAccessibilityHelp}
	>
		Show Help (Alt+0)
	</button>
</div>
