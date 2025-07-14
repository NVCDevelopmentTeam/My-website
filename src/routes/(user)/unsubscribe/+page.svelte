<script>
	import { siteTitle } from '$lib/data/config';
	import { page } from '$app/state';

	const pageTitle = 'Unsubscribe';
	const description = 'Unsubscribe';

	let email = $derived(page.data.email);
	let message = $state(''); // Declare as $state
	let loading = $state(false); // Declare as $state

	let unsubscribeToken = $derived(page.data.token); // Declare as $derived

	const confirmUnsubscribe = async () => {
		loading = true;
		try {
			const response = await fetch(
				`/api/unsubscribe.json?email=${encodeURIComponent(email)}&token=${unsubscribeToken}`,
				{
					method: 'GET'
				}
			);

			const result = await response.json();

			if (response.ok) {
				message = result.success;
			} else {
				message = `Error: ${result.error}`;
			}
		} catch {
			message = 'An error occurred. Please try again later.';
		} finally {
			loading = false;
		}
	};
</script>

<svelte:head>
	<title>{pageTitle} | {siteTitle}</title>
	<meta name="description" content={description} />
</svelte:head>

<div class="container mx-auto px-4 py-16">
	<div class="max-w-md mx-auto bg-card p-8 rounded-lg shadow-md text-center">
		{#if message}
			<p
				class="text-lg font-medium"
				class:text-destructive={message.startsWith('Error')}
				class:text-green-500={!message.startsWith('Error')}
			>
				{message}
			</p>
		{:else}
			<p class="text-lg text-foreground mb-4">Do you really want to unsubscribe?</p>
			<button
				onclick={confirmUnsubscribe}
				disabled={loading}
				class="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-semibold disabled:opacity-50"
			>
				{#if loading}
					Unsubscribing...
				{:else}
					Yes, Unsubscribe
				{/if}
			</button>
		{/if}
	</div>
</div>
