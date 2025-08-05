<script>
	import { onMount } from 'svelte';
	// import {
	// 	applyPreferences,
	// 	setupSkipLinks,
	// 	createLiveRegion
	// } from '$lib/utils/accessibility.js';
	import { browser } from '$app/environment';

	let { children } = $props();

	onMount(() => {
		if (browser) {
			// Initialize accessibility features
			// applyPreferences();
			// setupSkipLinks();
			// createLiveRegion();

			// Add accessibility CSS classes to body
			document.body.classList.add('accessibility-enabled');

			// Set up keyboard navigation
			// document.addEventListener('keydown', handleGlobalKeydown);

			// Clean up on destroy
			return () => {
				// document.removeEventListener('keydown', handleGlobalKeydown);
			};
		}
	});
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
		button,
		a,
		input,
		select,
		textarea {
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
