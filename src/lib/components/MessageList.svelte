<script>
    export let messages = []; // Ensure messages is an array

    // Scroll to the bottom of the message list when a new message is added
    let messageListContainer;

    $: scrollToBottom();

    function scrollToBottom() {
        if (messageListContainer) {
            messageListContainer.scrollTop = messageListContainer.scrollHeight;
        }
    }

    // Function to format message timestamps
    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
</script>

<!-- Message list container with accessibility support -->
<div
    class="message-list"
    bind:this={messageListContainer}
    aria-live="polite"
>
    {#each messages as message (message.id)}
        <!-- Message block, distinguish between 'me' and 'others' -->
        <div class="message {message.isMe ? 'me' : 'other'}">
            <span class="message-text" aria-label={`Message from ${message.sender}`}>
                {message.text}
            </span>
            <span class="message-time">
                {formatTimestamp(message.timestamp)}
            </span>
        </div>
    {/each}
</div>
