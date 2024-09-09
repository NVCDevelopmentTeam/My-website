<!-- MessageInput.svelte -->
<script>
    import { createEventDispatcher } from 'svelte';

    let message = '';
    let attachedFile = null;
    let emojiPickerVisible = false;

    const dispatch = createEventDispatcher();

    const emojis = ['😊', '😂', '😍', '👍', '🎉', '❤️', '😎'];

    function sendMessage() {
        if (message.trim() !== '' || attachedFile) {
            dispatch('messageSent', { message, attachedFile });
            message = '';
            attachedFile = null;
        }
    }

    function handleFileAttachment(event) {
        attachedFile = event.target.files[0];
    }

    function toggleEmojiPicker() {
        emojiPickerVisible = !emojiPickerVisible;
    }

    function addEmoji(emoji) {
        message += emoji;
        emojiPickerVisible = false;
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    }
</script>

<div>
    <label for="messageInput" class="sr-only">Message Input</label>
    <input
        id="messageInput"
        type="text"
        placeholder="Type your message..."
        bind:value={message}
        aria-label="Message input"
        aria-describedby="messageHelp"
        on:keypress={handleKeyPress} 
    />

    <span id="messageHelp" class="sr-only">
        Press Enter to send the message.
    </span>

    <button 
        on:click={toggleEmojiPicker} 
        aria-label="Toggle Emoji Picker" 
        aria-expanded={emojiPickerVisible} 
        aria-controls="emojiPicker">
        😊
    </button>

    {#if emojiPickerVisible}
        <div id="emojiPicker" role="dialog" aria-label="Emoji Picker">
            {#each emojis as emoji}
                <button on:click={() => addEmoji(emoji)} aria-label={`Insert emoji ${emoji}`}>
                    {emoji}
                </button>
            {/each}
        </div>
    {/if}

    <label for="fileInput" class="sr-only">Attach File</label>
    <input 
        id="fileInput" 
        type="file" 
        on:change={handleFileAttachment} 
        aria-label="Attach a file" 
    />

    <button on:click={sendMessage} aria-label="Send message">
        Send
    </button>
</div>

{#if attachedFile}
    <div aria-live="polite">
        Attached file: {attachedFile.name}
    </div>
{/if}
