import { writable } from 'svelte/store';
import { onMount } from 'svelte';

/**
 * @typedef {import('svelte/store').Writable<boolean>} WritableBoolean
 * @typedef {import('svelte/store').Writable<number>} WritableNumber
 */

/** @type {WritableBoolean} */
export const darkMode = writable(false);

/** @type {WritableBoolean} */
export const contrast = writable(false);

/** @type {WritableBoolean} */
export const colorFilters = writable(false);

/** @type {WritableBoolean} */
export const menuOpen = writable(false);

/**
 * Toggles dark mode on and off.
 */
export function toggleDarkMode() {
	darkMode.update((value) => {
		const isDark = !value;
		if (typeof document !== 'undefined') {
			document.body.classList.toggle('dark', isDark);
			announceMode('Dark mode', isDark);
		}
		return isDark;
	});
}

/**
 * Toggles high contrast mode.
 */
export function toggleContrast() {
	contrast.update((value) => {
		const hasContrast = !value;
		if (typeof document !== 'undefined') {
			document.body.classList.toggle('high-contrast', hasContrast);
			announceMode('High contrast mode', hasContrast);
		}
		return hasContrast;
	});
}

/**
 * Toggles color filters for accessibility.
 */
export function toggleColorFilters() {
	colorFilters.update((value) => {
		const hasFilters = !value;
		if (typeof document !== 'undefined') {
			document.body.classList.toggle('color-filters', hasFilters);
			announceMode('Color filters', hasFilters);
		}
		return hasFilters;
	});
}

/**
 * Announces mode changes to screen readers.
 * @param {string} mode The mode being changed.
 * @param {boolean} isEnabled Whether the mode is enabled or disabled.
 */
function announceMode(mode, isEnabled) {
	const announcer = document.getElementById('mode-announcer');
	if (announcer) {
		announcer.innerText = `${mode} is now ${isEnabled ? 'enabled' : 'disabled'}`;
		setTimeout(() => (announcer.innerText = ''), 1000);
	}
}

/**
 * Handles keydown events for accessibility, triggering an action on Enter or Space.
 * @param {KeyboardEvent} event
 * @param {() => void} action
 */
export function handleKeydown(event, action) {
	if (event.key === 'Enter' || event.key === ' ') {
		event.preventDefault();
		action();
	}
}

/**
 * Initializes accessibility features on component mount.
 */
export function initializeAccessibility() {
	onMount(() => {
		const unsubscribeDarkMode = darkMode.subscribe((value) => {
			if (typeof document !== 'undefined') {
				document.body.classList.toggle('dark', value);
			}
		});

		return () => {
			unsubscribeDarkMode();
		};
	});
}

/**
 * Sets up skip links for keyboard navigation.
 */
export function setupSkipLinks() {
	// This function can be expanded to dynamically add skip links if needed.
	// For now, it's a placeholder if the links are already in the markup.
}

/**
 * Creates a live region for screen reader announcements.
 */
export function createLiveRegion() {
	if (typeof document !== 'undefined' && !document.getElementById('live-region')) {
		const liveRegion = document.createElement('div');
		liveRegion.id = 'live-region';
		liveRegion.setAttribute('aria-live', 'polite');
		liveRegion.setAttribute('aria-atomic', 'true');
		liveRegion.className = 'sr-only';
		document.body.appendChild(liveRegion);
	}
}
