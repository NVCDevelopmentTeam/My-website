<script>
    import { onMount } from 'svelte';
    import ChatToolbar from '$lib/components/ChatToolbar.svelte';
    import MessageList from '$lib/components/MessageList.svelte';
    import MessageInput from '$lib/components/MessageInput.svelte';
    import { initChat, startChat, sendMessageToServer } from '$lib/data/message';

    let messages = [];
    let message = '';
    let chatOpen = false;
    let formFilled = false;
    let userInfo = {
        name: '',
        emailOrPhone: '',
        initialMessage: ''
    };
    const adminName = "Admin"; // Display name for the admin in the chat

    // Initialize chat connections on mount
    onMount(() => {
        initChat((data) => {
            messages = [...messages, { text: data.message, self: false, name: adminName }];
        });
    });

    // Toggle the chat window open or closed
    function toggleChat() {
        chatOpen = !chatOpen;
        if (chatOpen) {
            setTimeout(() => document.getElementById('name-input')?.focus(), 0);
        }
    }

    // Start the chat after the user fills in the form
    function handleStartChat() {
        if (userInfo.name && userInfo.emailOrPhone && userInfo.initialMessage) {
            startChat(userInfo, (updatedMessages) => {
                messages = updatedMessages;
            });
            formFilled = true;
            message = '';
            setTimeout(() => document.getElementById('message-input')?.focus(), 0);
        }
    }

    // Handle sending a message
    function handleSendMessage() {
        if (message.trim()) {
            sendMessageToServer(message, userInfo.name);
            messages = [...messages, { text: message, self: true, name: userInfo.name }];
            message = '';
        }
    }
</script>

<!-- Button to open/close chat -->
<button on:click={toggleChat} aria-label={chatOpen ? "Close chat" : "Open chat"}>
    {chatOpen ? '❌' : '💬'}
</button>

<!-- Chat window -->
{#if chatOpen}
    <div>
        {#if !formFilled}
            <!-- User information form before starting the chat -->
            <div>
                <label for="name-input">Name</label>
                <input id="name-input" type="text" bind:value={userInfo.name} placeholder="Name" />

                <label for="email-input">Email or Phone</label>
                <input id="email-input" type="text" bind:value={userInfo.emailOrPhone} placeholder="Email or Phone" />

                <label for="message-input">Your message</label>
                <textarea id="message-input" bind:value={userInfo.initialMessage} placeholder="Your message..."></textarea>

                <button on:click={handleStartChat} aria-label="Start Chat">Start Chat</button>
            </div>
        {:else}
            <!-- Chat toolbar -->
            <ChatToolbar startVideoCall={startVideoCall} startVoiceCall={startVoiceCall} />

            <!-- Message display area -->
            <MessageList {messages} {adminName} />

            <!-- Message input area -->
            <MessageInput bind:message on:sendMessage={handleSendMessage} />
        {/if}
    </div>
{/if}
