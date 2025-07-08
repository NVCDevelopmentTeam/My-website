<script>
	import '../app.css';
	import { siteTitle, siteDescription } from '$lib/data/config';
	let { children } = $props();
</script>

<svelte:head>
	<title>{siteTitle}</title>
	<meta name="description" content={siteDescription} />
</svelte:head>
<main>
	{@render children?.()}
</main>
