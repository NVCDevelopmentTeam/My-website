<script>
	import { tick } from 'svelte';

	// Props for receiving messages
	const { messages = [] } = $props(); // Use $props() to declare props

	// Reactive state for the container element
	let listContainer = $state();

	/**
	 * Formats a timestamp into a human-readable time string.
	 * @param {number} timestamp - The timestamp to format.
	 * @returns {string} - Formatted time string (e.g., "02:30 PM").
	 */
	function formatTime(timestamp) {
		return new Date(timestamp).toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	/**
	 * Scrolls the message list to the bottom when new messages are added.
	 */
	async function scrollToBottom() {
		await tick(); // Wait for DOM updates to complete
		if (listContainer) {
			listContainer.scrollTop = listContainer.scrollHeight;
		}
	}

	// Watch for changes in the messages array and scroll to the bottom
	$effect(() => {
		scrollToBottom();
	}); // No need for a dependency array; $effect tracks `messages` automatically
</script>

<!-- Message List UI -->
<div class="flex-1 overflow-y-auto p-4 space-y-4" bind:this={listContainer}>
	{#each messages as msg (msg.id)}
		<div class="flex flex-col {msg.isMe ? 'items-end' : 'items-start'}">
			<div class="flex items-center space-x-2 text-xs text-muted-foreground">
				<span class="font-semibold">{msg.sender}</span>
				<span class="text-muted-foreground">{formatTime(msg.timestamp)}</span>
			</div>
			<div
				class="p-3 rounded-lg {msg.isMe
					? 'bg-primary text-primary-foreground'
					: 'bg-secondary text-secondary-foreground'} shadow"
			>
				{msg.text}
			</div>
		</div>
	{/each}
</div>
