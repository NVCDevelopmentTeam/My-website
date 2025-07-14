<script>
	import Dialog from './Dialog.svelte';
	import VoiceCall from './VoiceCall.svelte';
	import VideoCall from './VideoCall.svelte';

	// Props for socket and roomId
	let { socket, roomId } = $props();

	let dialog = $state();
</script>

<!-- Chat Toolbar UI -->
<div class="flex justify-around p-2 border-b border-border">
	<div>
		<button
			onclick={() => dialog.showModal()}
			class="px-3 py-1 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
			>Voice call</button
		>
		<Dialog bind:dialog on:close={() => console.log('closed')}>
			<VoiceCall {socket} {roomId} />
		</Dialog>
	</div>
	<div>
		<button
			onclick={() => dialog.showModal()}
			class="px-3 py-1 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
			>Video call</button
		>
		<Dialog bind:dialog on:close={() => console.log('closed')}>
			<VideoCall {socket} {roomId} />
		</Dialog>
	</div>
</div>
