<script>
	import LatestPosts from '$lib/components/LatestPosts.svelte';
	import SocialLinks from '$lib/components/SocialLinks.svelte';
	import Newsletter from '$lib/components/Newsletter.svelte';
	import VisitorStatistics from '$lib/components/VisitorStatistics.svelte';
</script>

<aside class="w-full md:w-1/3 lg:w-1/4 px-4">
	<div class="mb-8">
		<LatestPosts />
	</div>
	<div class="mb-8">
		<Newsletter />
	</div>
	<div class="mb-8">
		<SocialLinks />
	</div>
	<div class="mb-8">
		<VisitorStatistics />
	</div>
</aside>
