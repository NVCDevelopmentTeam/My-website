<script>
    export let message = '';
    export let sendMessage;

    // Handle file attachment
    function attachFile() {
        console.log("File attachment feature is not yet implemented.");
        // Placeholder for future file attachment functionality
    }

    // Handle sending emojis
    function sendEmoji() {
        console.log("Emoji sending feature is not yet implemented.");
        // Placeholder for future emoji functionality
    }

    // Handle sending messages
    function handleSendMessage() {
        if (message.trim()) {
            sendMessage(message);
            message = '';  // Clear the message input after sending
        }
    }

    // Prevent form submission on Enter key press
    function handleKeyDown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    }
</script>

<!-- Message input area -->
<div>
    <button title="Attach File" aria-label="Attach File" on:click={attachFile}>📎</button>
    <button title="Send Emoji" aria-label="Send Emoji" on:click={sendEmoji}>😊</button>
    <input
        id="message-input"
        type="text"
        bind:value={message}
        placeholder="Type your message..."
        on:keydown={handleKeyDown}
        aria-label="Message input"
    />
    <button on:click={handleSendMessage} aria-label="Send message">Send</button>
</div>
