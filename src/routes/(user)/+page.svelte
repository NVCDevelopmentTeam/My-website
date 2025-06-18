<script>
  import HeroSlider from '$lib/components/HeroSlider.svelte';
	import * as Accordition from '$lib/components/ui/accordion';
	import * as Popover from '$lib/components/ui/popover';
	import { notificationStore } from '$stores/notification';

	$effect(() => {
		console.log('notificationStore', $notificationStore);
	});
import { siteTitle, siteDescription } from "$lib/data/config";
const  pageTitle="home"
</script>
<svelte:head>
	      <title> {pageTitle}| {siteTitle}</title>
	<meta name="description" content={siteDescription} />
</svelte:head>
<HeroSlider slides={[
  { title:'Hi, anh Cường!', subtitle:'Dev năng động & tester a11y', ctaText:'Xem dự án', ctaLink:'/projects', img:'/slides/1.jpg' },
  { title:'Mọi thứ mình làm đều tối ưu', subtitle:'Hiệu năng ✨ accessibility', ctaText:'Liên hệ ngay', ctaLink:'/contact', img:'/slides/2.jpg' }
]} />

<section>
	<h1>
		to your new<br />SvelteKit app
	</h1>

	<h2>
		try editing <strong>src/routes/+page.svelte</strong>
	</h2>
	</section>
<Accordition.Root>
	<Accordition.Item value="item-1">
		<Accordition.Trigger>What is SvelteKit CMS?</Accordition.Trigger>
		<Accordition.Content>
			I want to build a CMS in Svelte with SvelteKit. So I just simply name it SvelteKit CMS.
		</Accordition.Content>
	</Accordition.Item>
</Accordition.Root>

<Popover.Root>
	<Popover.Trigger>Open</Popover.Trigger>
	<Popover.Content>Place content for the popover here.</Popover.Content>
</Popover.Root>

