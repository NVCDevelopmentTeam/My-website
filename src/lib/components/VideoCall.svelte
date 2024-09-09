<script>
  export let onStartCall;
  export let onEndCall;
  export let onToggleMute;
  export let onToggleVideo;
  export let localStream;
  export let remoteStream;
</script>

<div>
  {#if localStream}
    <video id="localVideo" bind:this={localStream} autoplay muted></video>
  {/if}
  {#if remoteStream}
    <video id="remoteVideo" bind:this={remoteStream} autoplay></video>
  {/if}
</div>
