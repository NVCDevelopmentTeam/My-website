import { writable } from 'svelte/store';
import { onMount } from 'svelte';

// Initialize stores
export const darkMode = writable(false);
export const fontSize = writable(16);
export const contrast = writable(false);
export const colorFilters = writable(false);
export const menuOpen = writable(false);

export const ACCESSIBILITY_SETTINGS = {
	fontSize: 'normal',
	contrast: 'normal',
	colorFilters: false
};

export function getStoredSettings() {
	try {
		const stored = localStorage.getItem('accessibility');
		return stored ? JSON.parse(stored) : ACCESSIBILITY_SETTINGS;
	} catch {
		return ACCESSIBILITY_SETTINGS;
	}
}

export function updateAccessibilitySettings(settings) {
	localStorage.setItem('accessibility', JSON.stringify(settings));
}

// Accessibility functions
export function toggleDarkMode() {
	darkMode.update((value) => {
		document.body.classList.toggle('dark', !value);
		announceMode('Dark mode', !value);
		return !value;
	});
}

export function increaseFontSize() {
	fontSize.update((size) => {
		const newSize = Math.min(size + 2, 20); // Add upper limit
		document.documentElement.style.fontSize = `${newSize}px`;
		announceFontSize(newSize);
		updateAccessibilitySettings({
			...getStoredSettings(),
			fontSize: newSize >= 18 ? 'large' : 'normal'
		});
		return newSize;
	});
}

export function decreaseFontSize() {
	fontSize.update((size) => {
		const newSize = Math.max(size - 2, 14); // Add lower limit
		document.documentElement.style.fontSize = `${newSize}px`;
		announceFontSize(newSize);
		updateAccessibilitySettings({
			...getStoredSettings(),
			fontSize: newSize >= 18 ? 'large' : 'normal'
		});
		return newSize;
	});
}

export function toggleContrast() {
	contrast.update((value) => {
		document.body.classList.toggle('high-contrast', !value);
		announceMode('High contrast mode', !value);
		updateAccessibilitySettings({
			...getStoredSettings(),
			contrast: !value ? 'high' : 'normal'
		});
		return !value;
	});
}

export function toggleColorFilters() {
	colorFilters.update((value) => {
		document.body.classList.toggle('color-filters', !value);
		announceMode('Color filters', !value);
		updateAccessibilitySettings({
			...getStoredSettings(),
			colorFilters: !value
		});
		return !value;
	});
}

// Helper functions
function announceFontSize(size) {
	announceChange('font-size-announcer', `Font size is now ${size}px`);
}

function announceMode(mode, isEnabled) {
	announceChange('mode-announcer', `${mode} is now ${isEnabled ? 'enabled' : 'disabled'}`);
}

function announceChange(announcerId, message) {
	const announcer = document.getElementById(announcerId);
	if (announcer) {
		announcer.innerText = message;
		setTimeout(() => (announcer.innerText = ''), 1000);
	}
}

export function handleKeydown(event, action) {
	if (event.key === 'Enter' || event.key === ' ') {
		event.preventDefault();
		action();
	}
}

// Initialize settings on mount
if (typeof window !== 'undefined') {
	onMount(() => {
		const stored = getStoredSettings();
		fontSize.set(stored.fontSize === 'large' ? 18 : 16);
		contrast.set(stored.contrast === 'high');
		colorFilters.set(stored.colorFilters);
		darkMode.subscribe((value) => document.body.classList.toggle('dark', value));
	});
}
