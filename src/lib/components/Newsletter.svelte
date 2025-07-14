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

<div class="bg-muted p-6 rounded-lg">
	<h2 class="text-xl font-bold mb-4">Subscribe to my newsletter</h2>
	<p class="text-muted-foreground mb-4">
		Get the latest posts and updates delivered to your inbox.
	</p>
	<form onsubmit={preventDefault(subscribe)} class="flex items-center gap-2">
		<input
			type="email"
			bind:value={email}
			placeholder="Enter your email"
			required
			class="w-full px-4 py-2 border rounded-md bg-input text-foreground focus:ring-primary focus:border-primary"
		/>
		<button
			type="submit"
			disabled={loading}
			class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
		>
			{#if loading}
				Subscribing...
			{:else}
				Subscribe
			{/if}
		</button>
	</form>
	{#if message}
		<p
			class="mt-4 text-sm"
			class:text-destructive={message.startsWith('Error')}
			class:text-green-500={!message.startsWith('Error')}
		>
			{message}
		</p>
	{/if}
</div>
