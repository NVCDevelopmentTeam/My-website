<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	// Reactive state variables
	let message = $state(''); // Tracks the input message
	let emojiPickerVisible = $state(false); // Controls visibility of the emoji picker

	/**
	 * Handles sending the message.
	 * Ensures the message is not empty before dispatching.
	 * @param {string} messageContent - The content of the message to send.
	 */
	function handleSend() {
		if (message.trim()) {
			dispatch('send', message); // Dispatch the 'send' event with the message content
			message = ''; // Clear the input field after sending
		}
	}

	/**
	 * Inserts an emoji into the message input.
	 * @param {string} emoji - The emoji to insert.
	 */
	function insertEmoji(emoji) {
		message += emoji; // Append the selected emoji to the current message
		emojiPickerVisible = false; // Hide the emoji picker after selection
	}
</script>

<!-- Message Input UI -->
<div class="flex items-center p-4 border-t border-border">
	<!-- Emoji Picker Section -->
	<div class="relative mr-2">
		<!-- Toggle emoji picker visibility -->
		<button
			onclick={() => (emojiPickerVisible = !emojiPickerVisible)}
			class="p-2 rounded-full hover:bg-muted">😊</button
		>
		{#if emojiPickerVisible}
			<div
				class="absolute bottom-full left-0 mb-2 bg-card p-2 rounded-md shadow-lg flex flex-wrap gap-1"
			>
				<!-- Render a list of emojis -->
				{#each ['😊', '😂', '😍', '👍', '🎉', '❤️', '😎'] as emoji (emoji)}
					<button onclick={() => insertEmoji(emoji)} class="p-1 hover:bg-muted rounded-md"
						>{emoji}</button
					>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Text Input Field -->
	<input
		class="flex-1 px-4 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary"
		type="text"
		bind:value={message}
		placeholder="Type your message..."
		onkeydown={(e) => e.key === 'Enter' && handleSend()}
	/>

	<!-- Send Button -->
	<button
		onclick={handleSend}
		class="ml-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
		>Send</button
	>
</div>
