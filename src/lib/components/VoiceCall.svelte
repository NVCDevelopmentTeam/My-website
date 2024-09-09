<script>
  export let onStartCall;
  export let onEndCall;
  export let onToggleMute;
</script>

<div>
  <button on:click={onStartCall}>Start Voice Call</button>
  <button on:click={onEndCall}>End Call</button>
  <button on:click={onToggleMute}>Toggle Mute</button>
</div>
