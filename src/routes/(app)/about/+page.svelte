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
		<h1 class="text-4xl font-bold text-center mb-8">About Me</h1>
		<div class="prose dark:prose-invert max-w-none">
			<p>
				Hi, I'm Cuong, a passionate software developer with a love for creating beautiful and
				accessible web experiences. I specialize in Svelte, SvelteKit, and Tailwind CSS, and I'm
				always looking for new ways to push the boundaries of what's possible on the web.
			</p>
			<p>
				This website is my personal playground, where I experiment with new technologies, share my
				thoughts on web development, and showcase my latest projects. I hope you enjoy your stay!
			</p>
		</div>
	</div>
</div>
