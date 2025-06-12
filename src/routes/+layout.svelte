<script>
	import '../app.postcss';
import { siteTitle } from '$lib/data/config';
	let { children } = $props();
</script>
<svelte:head>
<title>{siteTitle}</title>
</svelte:head>
<main>
		{@render children?.()}
</main>