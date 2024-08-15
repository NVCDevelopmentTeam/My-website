<script>
	import { siteTitle, siteURL } from '$lib/data/config';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	</script>

<svelte:head>
<title>{siteTitle}</title>
	<link rel="stylesheet" href="/css/vars.css" />
	<link rel="stylesheet" href="/css/root.css" />
	<link rel="stylesheet" href="/css/fonts.css" />
	<link rel="stylesheet" href="/css/typography.css" />
	<link rel="stylesheet" href="/css/layout.css" />
	<link rel="stylesheet" href="/css/components.css" />
	<link rel="stylesheet" href="/css/header-and-footer.css" />
	<link rel="stylesheet" href="/css/forms.css" />
	<link rel="stylesheet" href="/css/animation.css" />
	<link rel="stylesheet" href="/css/utilities.css" />
	<link rel="stylesheet" href="/css/code.css" />
	<link rel="stylesheet" href="/css/prism.css" />
	<link
		rel="alternate"
		type="application/rss+xml"
		title={siteTitle}
		href="http://{siteURL}/api/rss.xml"
	/>
</svelte:head>

		<Header />
  <main id="main">

		<slot />
<Sidebar />
 </main>

<Footer />
