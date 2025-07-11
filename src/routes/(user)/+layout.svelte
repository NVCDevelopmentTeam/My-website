<script>
	import { siteTitle, siteURL } from '$lib/data/config';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
</script>

<svelte:head>
	<title>{siteTitle}</title>
	<meta name="google-adsense-account" content="ca-pub-3602487920405886" />
	<link
		rel="alternate"
		type="application/rss+xml"
		title={siteTitle}
		href="http://{siteURL}/api/rss.xml"
	/>
</svelte:head>

<Header />
<main id="main">
	{@render children?.()}
	<Sidebar />
</main>

<Footer />
