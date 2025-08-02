<script>
	import { onMount } from 'svelte';
	import { initializeAccessibility, setupSkipLinks, createLiveRegion } from '$lib/utils/accessibility.js';
	import { browser } from '$app/environment';

	let { children } = $props();

	onMount(() => {
		if (browser) {
			// Initialize accessibility features
			initializeAccessibility();
			setupSkipLinks();
			createLiveRegion();

			// Add accessibility CSS classes to body
			document.body.classList.add('accessibility-enabled');

			// Set up keyboard navigation
			document.addEventListener('keydown', handleGlobalKeydown);

			// Clean up on destroy
			return () => {
				document.removeEventListener('keydown', handleGlobalKeydown);
			};
		}
	});

	function handleGlobalKeydown(event) {
		// Global keyboard shortcuts for accessibility
		if (event.altKey) {
			switch (event.key) {
				case '1':
					// Alt + 1: Focus main content
					event.preventDefault();
					const main = document.getElementById('main');
					if (main) {
						main.focus();
						main.scrollIntoView({ behavior: 'smooth' });
					}
					break;
				case '2':
					// Alt + 2: Focus navigation
					event.preventDefault();
					const nav = document.getElementById('nav');
					if (nav) {
						const firstLink = nav.querySelector('a');
						if (firstLink) {
							firstLink.focus();
						}
					}
					break;
				case '3':
					// Alt + 3: Focus search
					event.preventDefault();
					const search = document.getElementById('search');
					if (search) {
						search.focus();
					}
					break;
				case '0':
					// Alt + 0: Show accessibility help
					event.preventDefault();
					showAccessibilityHelp();
					break;
			}
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

<!-- Accessibility styles -->
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
		.reduce-motion *,
		.reduce-motion *::before,
		.reduce-motion *::after {
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.01ms !important;
			scroll-behavior: auto !important;
		}

		/* Screen reader optimizations */
		.screen-reader-optimized {
			--font-family: 'Times New Roman', serif;
		}

		/* Font size adjustments */
		:root {
			font-size: var(--base-font-size, 16px);
		}

		/* Focus indicators */
		*:focus-visible {
			outline: 2px solid var(--primary, #0066cc);
			outline-offset: 2px;
		}

		/* Skip links */
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

		.sr-only:focus,
		.focus-within\:not-sr-only:focus-within {
			position: static;
			width: auto;
			height: auto;
			padding: inherit;
			margin: inherit;
			overflow: visible;
			clip: auto;
			white-space: normal;
		}

		/* Touch targets */
		button, a, input, select, textarea {
			min-height: 44px;
			min-width: 44px;
		}

		/* Loading states */
		.loading {
			cursor: wait;
		}

		.loading * {
			pointer-events: none;
		}

		/* Error states */
		.error {
			border-color: #dc2626;
			background-color: #fef2f2;
		}

		/* Success states */
		.success {
			border-color: #16a34a;
			background-color: #f0fdf4;
		}
	</style>
</svelte:head>

<!-- Live region for announcements -->
<div id="live-region" aria-live="polite" aria-atomic="true" class="sr-only"></div>

<!-- Main content wrapper -->
{@render children()}

<!-- Accessibility toolbar (hidden by default, shown on focus) -->
<div class="sr-only focus-within:not-sr-only fixed bottom-4 right-4 bg-background border rounded-lg shadow-lg p-4 z-50">
	<h3 class="text-sm font-bold mb-2">Accessibility Tools</h3>
	<div class="space-y-2">
		<button
			class="block w-full text-left text-sm px-2 py-1 rounded hover:bg-muted"
			onclick={() => document.getElementById('main')?.focus()}
		>
			Jump to Main Content (Alt+1)
		</button>
		<button
			class="block w-full text-left text-sm px-2 py-1 rounded hover:bg-muted"
			onclick={() => document.getElementById('nav')?.querySelector('a')?.focus()}
		>
			Jump to Navigation (Alt+2)
		</button>
		<button
			class="block w-full text-left text-sm px-2 py-1 rounded hover:bg-muted"
			onclick={() => document.getElementById('search')?.focus()}
		>
			Jump to Search (Alt+3)
		</button>
		<button
			class="block w-full text-left text-sm px-2 py-1 rounded hover:bg-muted"
			onclick={showAccessibilityHelp}
		>
			Show Help (Alt+0)
		</button>
	</div>
</div>

