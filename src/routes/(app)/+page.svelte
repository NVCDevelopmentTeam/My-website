<script>
	import Banner from '$lib/components/Banner.svelte';
	import HeroSlider from '$lib/components/HeroSlider.svelte';

	import { notificationStore } from '$stores/notification';

	$effect(() => {
		console.log('notificationStore', $notificationStore);
	});
	import { siteTitle } from '$lib/data/config';
	const pageTitle = 'home';
	const description = 'This is my website';
</script>

<svelte:head>
	<title>{pageTitle} | {siteTitle}</title>
	<meta name="description" content={description} />
</svelte:head>
<HeroSlider
	slides={[
		{
			title: "Hi, I'm Cuong!",
			subtitle: 'A passionate developer & a11y tester',
			ctaText: 'View my projects',
			ctaLink: '/projects',
			img: ''
		},
		{
			title: 'I build things for the web',
			subtitle: 'with a focus on performance & accessibility',
			ctaText: 'Get in touch',
			ctaLink: '/contact',
			img: ''
		}
	]}
/>
<Banner />
<section class="py-16">
	<div class="container mx-auto px-4">
		<h1 class="text-4xl font-bold text-center mb-8">Welcome to my website!</h1>
		<p class="text-lg text-center text-muted-foreground">
			I\'m a software developer with a passion for creating beautiful and accessible web
			experiences. I specialize in Svelte, SvelteKit, and Tailwind CSS.
		</p>
	</div>
</section>
