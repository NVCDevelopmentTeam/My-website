<script>
	import { preventDefault } from 'svelte/legacy';

	let email = $state('');
	let message = $state('');
	let loading = $state(false);

	const subscribe = async () => {
		loading = true;
		try {
			const response = await fetch('/api/subscribe.json', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email })
			});

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

<h2>Subscribe to the to receive useful articles from me</h2>
<form onsubmit={preventDefault(subscribe)} class="subscribe-form">
	<input
		type="email"
		bind:value={email}
		placeholder="Enter your email"
		required
		class="email-input"
	/>
	<button type="submit" disabled={loading} class="subscribe-button">
		{#if loading}
			Subscribing...
		{/if}
		{#if !loading}
			Subscribe
		{/if}
	</button>
</form>

{#if message}
	<p class="message">{message}</p>
{/if}
