<script>
  import { onMount, onDestroy } from 'svelte';
  import { initSocket, joinRoom, sendMessage } from '$lib/data/liveChat';
  import MessageInput from './MessageInput.svelte';
  import MessageList from './MessageList.svelte';
  import ChatToolbar from './ChatToolbar.svelte';

  // Reactive state variables (no reassignment allowed for exported states)
  const isChatVisible = $state(false);
  const isChatStarted = $state(false);
  const messages = $state([]);
  const roomId = $state(null);
  const errors = $state({ name: '', contact: '', message: '' });

  // Component state
  const userInfo = $state({
    name: '',
    email: '',
    phone: '',
    initialMessage: ''
  });

  let socket = $state();

  onMount(async () => {
    try {
      socket = await initSocket();
      setupSocketHandlers();
    } catch (error) {
      console.error('Connection failed:', error);
    }
  });

  function setupSocketHandlers() {
    socket.on('chat-message', ({ message, sender, timestamp }) => {
      messages.push({
        id: Date.now(),
        text: message,
        sender,
        timestamp,
        isMe: sender === 'user'
      });
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  function validateForm() {
    let valid = true;
    const newErrors = { name: '', contact: '', message: '' };

    if (!userInfo.name.trim()) {
      newErrors.name = 'Please enter your name';
      valid = false;
    }
    if (!userInfo.email && !userInfo.phone) {
      newErrors.contact = 'Please enter email or phone';
      valid = false;
    }
    if (!userInfo.initialMessage.trim()) {
      newErrors.message = 'Please enter a message';
      valid = false;
    }

    Object.assign(errors, newErrors); // Mutate properties instead of reassigning
    return valid;
  }

  async function handleStartChat(event) {
    event.preventDefault(); // Prevent default form submission behavior

    if (!validateForm()) return;

    try {
      const newRoomId = `room-${Date.now()}`;
      await joinRoom(socket, newRoomId);
      roomId.value = newRoomId; // Use `.value` to mutate the state
      await sendMessage(socket, newRoomId, userInfo.initialMessage);
      isChatStarted.value = true; // Use `.value` to mutate the state
    } catch (error) {
      Object.assign(errors, { ...errors, general: error.message }); // Mutate properties
    }
  }

  async function handleNewMessage(content) {
    try {
      await sendMessage(socket, roomId.value, content);
    } catch (error) {
      Object.assign(errors, { ...errors, general: 'Failed to send message' }); // Mutate properties
    }
  }

  onDestroy(() => {
    socket?.disconnect();
  });
</script>

<!-- Chat toggle button -->
<button
  class="chat-toggle"
  onclick={() => isChatVisible.value = !isChatVisible.value}
  aria-label={isChatVisible.value ? 'Close chat' : 'Open chat'}
>
  {isChatVisible.value ? '×' : '💬'}
</button>

<!-- Chat window -->
{#if isChatVisible.value}
  <div class="chat-window">
    {#if !isChatStarted.value}
      <form onsubmit={handleStartChat}> <!-- Updated to use the new 'onsubmit' syntax -->
        <div class="form-group">
          <input type="text" bind:value={userInfo.name} placeholder="Name" />
          {#if errors.name}<span class="error">{errors.name}</span>{/if}
        </div>
        <div class="form-group">
          <input type="email" bind:value={userInfo.email} placeholder="Email" />
          <input type="tel" bind:value={userInfo.phone} placeholder="Phone" />
          {#if errors.contact}<span class="error">{errors.contact}</span>{/if}
        </div>
        <div class="form-group">
          <textarea bind:value={userInfo.initialMessage} placeholder="Message"></textarea>
          {#if errors.message}<span class="error">{errors.message}</span>{/if}
        </div>
        <button type="submit">Start Chat</button>
      </form>
    {:else}
      <div class="chat-container">
        <MessageList {messages} />
        <ChatToolbar {socket} {roomId} />
        <MessageInput onsend={handleNewMessage} />
      </div>
    {/if}
  </div>
{/if}
