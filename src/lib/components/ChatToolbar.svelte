<script>
	import Dialog from './Dialog.svelte';
	import VoiceCall from './VoiceCall.svelte';
	import VideoCall from './VideoCall.svelte';

	// Props for socket and roomId
	let { socket, roomId } = $props();

	let dialog = $state();
</script>

<!-- Chat Toolbar UI -->
<div class="chat-toolbar">
	<div>
		<button onclick={() => dialog.showModal()}>Voice call</button>
		<Dialog bind:dialog on:close={() => console.log('closed')}>
			<VoiceCall {socket} {roomId} />
		</Dialog>
	</div>
	<div>
		<button onclick={() => dialog.showModal()}>Video call</button>
		<Dialog bind:dialog on:close={() => console.log('closed')}>
			<VideoCall {socket} {roomId} />
		</Dialog>
	</div>
</div>
