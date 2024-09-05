<script>
    import { onMount } from 'svelte';
import { startVideoCall } from '$lib/data/call';
    export let localStream;
    export let remoteStream;
    export let startVideoCall;
    export let endCall;
    export let answerCall;
    export let declineCall;

    let localVideo;
    let remoteVideo;
    let callState = 'idle'; // 'idle', 'outgoing', 'incoming', 'connected'
    let callTimer;

    onMount(() => {
        if (localStream) {
            localVideo.srcObject = localStream;
        }
        if (remoteStream) {
            remoteVideo.srcObject = remoteStream;
        }
    });

    // Start the call and transition to 'outgoing' state
    function initiateCall() {
        callState = 'outgoing';
        startVideoCall();
        setTimeout(() => {
            callState = 'incoming';
        }, 1000); // Simulate 1 second delay for incoming call
    }

    // When the call is answered, transition to 'connected' state
    function handleAnswerCall() {
        callState = 'connected';
        answerCall();
        startCallTimer();
    }

    // Handle call end, reset state and stop timer
    function handleEndCall() {
        callState = 'idle';
        endCall();
        clearInterval(callTimer);
    }

    // Call timer logic
    let minutes = 0;
    let seconds = 0;
    function startCallTimer() {
        callTimer = setInterval(() => {
            seconds++;
            if (seconds === 60) {
                seconds = 0;
                minutes++;
            }
        }, 1000);
    }
</script>

<!-- Call Control Buttons -->
{#if callState === 'idle'}
    <button title="Video Call" aria-label="Video Call" on:click={initiateCall}>📹</button>
{/if}

<!-- Outgoing Call Screen -->
{#if callState === 'outgoing'}
    <div style="display: flex; flex-direction: column; align-items: center;">
        <p>Calling...</p>
        <video bind:this={localVideo} autoplay muted style="width: 100%; border: 1px solid #ccc; border-radius: 5px;" aria-label="Local video"></video>
        <button on:click={handleEndCall} style="padding: 10px 20px; font-size: 16px; background-color: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;" aria-label="End call">
            Cancel Call
        </button>
    </div>
{/if}

<!-- Incoming Call Screen -->
{#if callState === 'incoming'}
    <div style="display: flex; flex-direction: column; align-items: center;">
        <p>Incoming Call...</p>
        <button on:click={handleAnswerCall} style="padding: 10px 20px; font-size: 16px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;" aria-label="Answer call">
            Answer
        </button>
        <button on:click={handleEndCall} style="padding: 10px 20px; font-size: 16px; background-color: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;" aria-label="Decline call">
            Decline
        </button>
    </div>
{/if}

<!-- Ongoing Call Screen -->
{#if callState === 'connected'}
    <div style="display: flex; flex-direction: column; align-items: center; padding: 10px; background: #eee; border: 1px solid #ddd;">
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
            <!-- Local video -->
            <div style="flex: 1;">
                <video bind:this={localVideo} autoplay muted style="width: 100%; border: 1px solid #ccc; border-radius: 5px;" aria-label="Local video"></video>
            </div>

            <!-- Remote video -->
            <div style="flex: 1;">
                <video bind:this={remoteVideo} autoplay style="width: 100%; border: 1px solid #ccc; border-radius: 5px;" aria-label="Remote video"></video>
            </div>
        </div>

        <!-- Call Control Buttons -->
        <div style="display: flex; gap: 10px; margin-top: 10px;">
            <button on:click={() => toggleMute()} style="padding: 10px 20px; font-size: 16px; background-color: #f0ad4e; color: white; border: none; border-radius: 5px; cursor: pointer;" aria-label="Toggle mute">
                🎤 Mute/Unmute
            </button>
            <button on:click={() => toggleCamera()} style="padding: 10px 20px; font-size: 16px; background-color: #5bc0de; color: white; border: none; border-radius: 5px; cursor: pointer;" aria-label="Toggle camera">
                📷 Camera On/Off
            </button>
            <button on:click={() => switchCamera()} style="padding: 10px 20px; font-size: 16px; background-color: #0275d8; color: white; border: none; border-radius: 5px; cursor: pointer;" aria-label="Switch camera">
                🔄 Switch Camera
            </button>
            <button on:click={handleEndCall} style="padding: 10px 20px; font-size: 16px; background-color: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;" aria-label="End call">
                End Call
            </button>
        </div>

        <!-- Call Timer -->
        <p>Call Duration: {minutes}:{seconds < 10 ? '0' : ''}{seconds}</p>
    </div>
{/if}
