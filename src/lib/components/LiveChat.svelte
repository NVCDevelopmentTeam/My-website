<script>
	import { onMount, onDestroy } from 'svelte';
	import { initSocket, joinRoom, sendMessage } from '$lib/data/liveChat';
	import MessageInput from './MessageInput.svelte';
	import MessageList from './MessageList.svelte';
	import ChatToolbar from './ChatToolbar.svelte';

	// Reactive state variables
	let isChatVisible = $state(false);
	let isChatStarted = $state(false);
	let messages = $state([]);
	let roomId = $state(null);
	let errors = $state({ name: '', contact: '', message: '' });

	// Component state
	let userInfo = $state({
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

		errors = newErrors;
		return valid;
	}

	async function handleStartChat(event) {
		event.preventDefault();

		if (!validateForm()) return;

		try {
			const newRoomId = `room-${Date.now()}`;
			await joinRoom(socket, newRoomId);
			roomId = newRoomId;
			await sendMessage(socket, newRoomId, userInfo.initialMessage);
			isChatStarted = true;
		} catch (error) {
			errors = { ...errors, general: error.message };
		}
	}

	async function handleNewMessage(content) {
		try {
			await sendMessage(socket, roomId, content);
		} catch {
			errors = { ...errors, general: 'Failed to send message' };
		}
	}

	onDestroy(() => {
		socket?.disconnect();
	});
</script>

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
		{#if !isChatStarted}
			<form onsubmit={handleStartChat} class="p-4 space-y-4">
				<div class="mb-4">
					<input
						type="text"
						bind:value={userInfo.name}
						placeholder="Name"
						class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
					/>
					{#if errors.name}<span class="text-destructive text-sm">{errors.name}</span>{/if}
				</div>
				<div class="mb-4">
					<input
						type="email"
						bind:value={userInfo.email}
						placeholder="Email"
						class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary mb-2"
					/>
					<input
						type="tel"
						bind:value={userInfo.phone}
						placeholder="Phone"
						class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
					/>
					{#if errors.contact}<span class="text-destructive text-sm">{errors.contact}</span>{/if}
				</div>
				<div class="mb-4">
					<textarea
						bind:value={userInfo.initialMessage}
						placeholder="Message"
						class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary h-24"
					></textarea>
					{#if errors.message}<span class="text-destructive text-sm">{errors.message}</span>{/if}
				</div>
				<button
					type="submit"
					class="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors"
					>Start Chat</button
				>
			</form>
		{:else}
			<div class="flex flex-col h-full">
				<MessageList {messages} />
				<ChatToolbar {socket} {roomId} />
				<MessageInput onsend={handleNewMessage} />
			</div>
		{/if}
	</div>
{/if}
