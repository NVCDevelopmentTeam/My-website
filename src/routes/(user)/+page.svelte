<!-- @migration-task Error while migrating Svelte code: Unterminated string constant -->
<!-- @migration-task Error while migrating Svelte code: Unterminated string constant -->
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
			title: 'Hi, anh Cường!',
			subtitle: 'Dev năng động & tester a11y',
			ctaText: 'Xem dự án',
			ctaLink: '/projects',
			img: ''
		},
		{
			title: 'Mọi thứ mình làm đều tối ưu',
			subtitle: 'Hiệu năng ✨ accessibility',
			ctaText: 'Liên hệ ngay',
			ctaLink: '/contact',
			img: ''
		}
	]}
/>
<Banner />
<section>
	<h1>
		to your new<br />SvelteKit app
	</h1>

	<h2>
		try editing <strong>src/routes/+page.svelte</strong>
	</h2>
</section>
