<script>
	import { siteTitle } from '$lib/data/config';
	const pageTitle = 'About';
	const description = 'This is about page';
</script>

<svelte:head>
	<title>{pageTitle} | {siteTitle}</title>
	<meta name="description" content={description} />
</svelte:head>

<div class="container mx-auto px-4 py-16">
	<div class="max-w-3xl mx-auto">
		<h1 class="text-4xl font-bold text-center mb-8">Privacy Policy</h1>

		<p class="text-lg text-muted-foreground mb-4">
			This is a <a href="https://kit.svelte.dev" class="text-primary hover:underline">SvelteKit</a> app.
			You can make your own by typing the following into your command line and following the prompts:
		</p>

		<pre class="bg-muted p-4 rounded-md text-sm font-mono mb-4">npm create svelte@latest</pre>

		<p class="text-lg text-muted-foreground mb-4">
			The page you're looking at is purely static HTML, with no client-side interactivity needed.
			Because of that, we don't need to load any JavaScript. Try viewing the page's source, or
			opening the devtools network panel and reloading.
		</p>

		<!-- <p>
		The <a href="/sverdle">Sverdle</a> page illustrates SvelteKit's data loading and form handling. Try
		using it with JavaScript disabled!
	</p> -->
	</div>
</div>
