<script>
	import { onMount } from 'svelte';
	import { accessibilityStore } from '$stores/accessibility';
	import {
		updateAccessibilitySettings,
		getStoredSettings
	} from '$lib/utils/accessibility';

	onMount(() => {
		const stored = getStoredSettings();
		accessibilityStore.set(stored);
		updateAccessibilitySettings(stored);
	});

	accessibilityStore.subscribe((settings) => {
		if (typeof window !== 'undefined') {
			updateAccessibilitySettings(settings);
		}
	});
</script>

<slot />

<!-- Skip link -->
<a
	href="#main-content"
	id="skip-to-content"
	class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:outline-none focus:ring-2 focus:ring-primary"
>
	Skip to main content
</a>

<!-- Live region for announcements -->
<div id="live-region" aria-live="polite" aria-atomic="true" class="sr-only"></div>