<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import MessageInput from '$lib/components/MessageInput.svelte';
    import MessageList from '$lib/components/MessageList.svelte';
    import { initChat, startChat, sendMessage } from '$lib/data/message';

    let isChatVisible = false;
    let isChatStarted = false;
    const messages = writable([]); // Changed to const for clarity

    let userInfo = {
        name: '',
        email: '',
        phone: '',
        message: ''
    };

    let errors = {
        name: '',
        contact: '',
        message: ''
    };

    $: isEmailOrPhoneProvided = userInfo.email.trim() !== '' || userInfo.phone.trim() !== '';

    function validateForm() {
        errors = {
            name: userInfo.name.trim() === '' ? 'Name is required' : '',
            contact: !isEmailOrPhoneProvided ? 'Either email or phone number is required' : '',
            message: userInfo.message.trim() === '' ? 'Message is required' : ''
        };
        return !Object.values(errors).some(error => error !== '');
    }

    async function handleStartChat() {
        if (validateForm()) {
            const chatUserInfo = {
                name: userInfo.name,
                emailOrPhone: userInfo.email || userInfo.phone,
                initialMessage: userInfo.message
            };
            try {
                await startChat(chatUserInfo, updateMessages);
                isChatStarted = true;
            } catch (error) {
                console.error("Failed to start chat:", error);
            }
        }
    }

    function updateMessages(newMessages) {
        messages.set(newMessages);
    }

    onMount(() => {
        initChat(updateMessages);
    });

    function toggleChat() {
        isChatVisible = !isChatVisible;
    }

    function handleMessageSent(msg) {
        sendMessage(msg, { name: userInfo.name }, updateMessages);
    }
</script>

<!-- Button to toggle the chat window -->
<button on:click={toggleChat}>
    {isChatVisible ? 'Close Chat' : 'Open Chat'}
</button>

<!-- Chat interface -->
{#if isChatVisible}
    {#if !isChatStarted}
        <div>
            <!-- Input for user's name -->
            <input
                type="text"
                placeholder="Enter your name"
                bind:value={userInfo.name}
                aria-label="Name input"
            />
            {#if errors.name}
                <div role="alert">{errors.name}</div>
            {/if}

            <!-- Input for email -->
            <input
                type="email"
                placeholder="Enter your email"
                bind:value={userInfo.email}
                aria-label="Email input"
            />

            <!-- Input for phone number -->
            <input
                type="tel"
                placeholder="Enter your phone number"
                bind:value={userInfo.phone}
                aria-label="Phone number input"
            />
            {#if errors.contact}
                <div role="alert">{errors.contact}</div>
            {/if}

            <!-- Input for the initial message -->
            <textarea
                placeholder="Enter your message"
                bind:value={userInfo.message}
                aria-label="Message input"
            ></textarea>
            {#if errors.message}
                <div role="alert">{errors.message}</div>
            {/if}

            <!-- Button to start the chat -->
            <button on:click={handleStartChat}>Start Chat</button>
        </div>
    {:else}
        <!-- Display the message list and input components -->
        <MessageList messages={$messages} /> <!-- Pass the store's value -->
        <MessageInput on:messageSent={handleMessageSent} /> <!-- Correct event binding -->
    {/if}
{/if}
