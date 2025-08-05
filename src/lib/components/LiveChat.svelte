<script>
	import { onMount, onDestroy } from 'svelte';
	import socket, { sendMessage, onMessage } from '$lib/data/liveChat';
	import MessageInput from './MessageInput.svelte';
	import MessageList from './MessageList.svelte';
	import ChatToolbar from './ChatToolbar.svelte';

	// Reactive state variables
	let isChatVisible = $state(false);
	let isChatStarted = $state(false);
	let messages = $state([]);
	let roomId = $state(null);
	let errors = $state({ name: '', contact: '', message: '', general: '' });

	// Component state
	let userInfo = $state({
		name: '',
		email: '',
		phone: '',
		initialMessage: ''
	});

	onMount(() => {
		onMessage((msg) => {
			messages = [...messages, msg];
		});

		return () => {
			socket.disconnect();
		};
	});

	async function handleNewMessage(event) {
		try {
			sendMessage(event.detail);
		} catch {
			errors = { ...errors, general: 'Failed to send message' };
		}
	}

	onDestroy(() => {
		socket?.disconnect();
	});
</script>
<Enter the name, email, phone number and the first message to verify the person who is chatting with the admin>
<!-- Chat toggle button -->
<button
	class="fixed bottom-4 right-4 bg-primary text-primary-foreground p-4 rounded-full shadow-lg z-50 hover:bg-primary/90 transition-colors"
	onclick={() => (isChatVisible = !isChatVisible)}
	aria-label={isChatVisible ? 'Close chat' : 'Open chat'}
>
	{isChatVisible ? '×' : '💬'}
</button>

<!-- Chat window -->
{#if isChatVisible}
	<div
		class="fixed bottom-20 right-4 w-80 h-[400px] bg-card rounded-lg shadow-xl flex flex-col z-50"
	>
		<div class="flex flex-col h-full">
			<MessageList {messages} />
			<ChatToolbar {socket} {roomId} />
			<MessageInput on:send={handleNewMessage} />
		</div>
	</div>
{/if}
