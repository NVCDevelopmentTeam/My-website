import { writable } from 'svelte/store';

export const preferences = writable({
	'font-size': '16px',
	'high-contrast': false,
	'reduce-motion': false
});
