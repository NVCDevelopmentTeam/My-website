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
<div class="message-list" bind:this={listContainer}>
  {#each messages as msg (msg.id)}
    <div class="message {msg.isMe ? 'outgoing' : 'incoming'}">
      <div class="message-header">
        <span class="sender">{msg.sender}</span>
        <span class="time">{formatTime(msg.timestamp)}</span>
      </div>
      <div class="message-content">{msg.text}</div>
    </div>
  {/each}
</div>