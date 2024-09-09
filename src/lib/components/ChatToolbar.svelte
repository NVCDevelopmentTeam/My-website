<script>
  export let onStartChat;
  export let onStartCall;
  export let onEndCall;
  export let onToggleMute;
  export let onToggleVideo;
</script>

<div>
  <button on:click={onStartChat}>Start Chat</button>
  <button on:click={onStartCall}>Start Call</button>
  <button on:click={onEndCall}>End Call</button>
  <button on:click={onToggleMute}>Toggle Mute</button>
  <button on:click={onToggleVideo}>Toggle Video</button>
</div>
