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

{#if message}
	<p>{message}</p>
{:else}
	<p>Do you really want to unsubscribe?</p>
	<button onclick={confirmUnsubscribe} disabled={loading}>
		{#if loading}
			Unsubscribing...
		{/if}
		{#if !loading}
			Yes, Unsubscribe
		{/if}
	</button>
{/if}
