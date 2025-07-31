import { writable } from 'svelte/store';

export const currentPage = writable('');
export const isMenuOpen = writable(false);

export function toggleMenu() {
	isMenuOpen.update((value) => !value);
}
