<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	// Reactive state variables
	let message = $state(''); // Tracks the input message
	let emojiPickerVisible = $state(false); // Controls visibility of the emoji picker

	/**
	 * Handles sending the message.
	 * Ensures the message is not empty before dispatching.
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
<div class="message-input">
	<!-- Emoji Picker Section -->
	<div class="emoji-picker">
		<!-- Toggle emoji picker visibility -->
		<button onclick={() => (emojiPickerVisible = !emojiPickerVisible)}>😊</button>
		{#if emojiPickerVisible}
			<div class="emoji-list">
				<!-- Render a list of emojis -->
				{#each ['😊', '😂', '😍', '👍', '🎉', '❤️', '😎'] as emoji (emoji)}
					<button onclick={() => insertEmoji(emoji)}>{emoji}</button>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Text Input Field -->
	<input
		type="text"
		bind:value={message}
		placeholder="Type your message..."
		onkeydown={(e) => e.key === 'Enter' && handleSend()}
	/>

	<!-- Send Button -->
	<button onclick={handleSend}>Send</button>
</div>
