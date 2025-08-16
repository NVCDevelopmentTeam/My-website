<script>
	import Contact from '$lib/components/Contact.svelte';
	import { siteTitle } from '$lib/data/config';
	const pageTitle = 'contact';
	const description = 'contact me';
</script>

<svelte:head>
	<title>{pageTitle} | {siteTitle}</title>
	<meta name="description" content={description} />
</svelte:head>

<div class="container mx-auto px-4 py-16">
	<div class="max-w-3xl mx-auto">
		<h1 class="text-4xl font-bold text-center mb-8">Contact Me</h1>
		<Contact />
	</div>
</div>
