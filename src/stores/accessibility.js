import { writable } from 'svelte/store';

export const ACCESSIBILITY_SETTINGS = {
  fontSize: 'normal',
  contrast: 'normal',
  colorFilters: false
};

export const accessibilityStore = writable(ACCESSIBILITY_SETTINGS);
