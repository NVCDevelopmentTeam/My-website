<script>
	import { page } from '$app/state';
	import { siteAuthor } from '$lib/data/config';
	import LiveChat from './LiveChat.svelte';
	import BackToTop from './BackToTop.svelte';
	import { onMount } from 'svelte';

	let year = $state(new Date().getFullYear());
	onMount(() => {
		year = new Date().getFullYear();
	});
</script>

<footer id="footer" aria-label="Site footer" class="bg-muted text-muted-foreground mt-8">
	<div class="container mx-auto px-4 py-6">
		<nav class="mb-4">
			<ul class="flex space-x-4">
				<li>
					<a
						href="/privacy-policy"
						class="hover:underline"
						aria-current={page.url.pathname === '/privacy-policy' ? 'page' : undefined}
						>Privacy Policy</a
					>
				</li>
				<li>
					<a
						href="/accessibility-statement"
						class="hover:underline"
						aria-current={page.url.pathname === '/accessibility-statement' ? 'page' : undefined}
						>Accessibility Statement</a
					>
				</li>
			</ul>
		</nav>
		<div class="flex flex-col md:flex-row md:justify-between items-center">
			<span class="text-sm">&copy; {year} {siteAuthor}. All rights reserved.</span>
			<BackToTop />
		</div>
	</div>
	<LiveChat />
</footer>
