<script>
import Contact from "$lib/components/Contact.svelte";
import { siteTitle } from "$lib/data/config";
const  pageTitle="contact";
const description="contact me";
</script>

<svelte:head>
	      <title> {pageTitle} | {siteTitle}</title>
	<meta name="description" content={description} />
</svelte:head>

<h3>Contact Us</h3>

<Contact />
