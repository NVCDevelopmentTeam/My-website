<script>
    import { onMount } from 'svelte';
    import { startVoiceCall } from '$lib/data/call';
    export let localStream;
    export let remoteStream;
    export let startVoiceCall;
    export let endCall;
    export let answerCall;
    export let declineCall;

    let remoteAudio;
    let localAudio;
    let callState = 'idle'; // 'idle', 'outgoing', 'incoming', 'connected'
    let callTimer;

    onMount(() => {
        if (localStream) {
            localAudio.srcObject = localStream;
        }
        if (remoteStream) {
            remoteAudio.srcObject = remoteStream;
        }
    });

    // Start the voice call and transition to 'outgoing' state
    function initiateCall() {
        callState = 'outgoing';
        startVoiceCall();
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

    // Toggle mute/unmute
    function toggleMute() {
        localAudio.muted = !localAudio.muted;
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
    <button title="Voice Call" aria-label="Voice Call" on:click={initiateCall}>🎤</button>
{/if}

<!-- Outgoing Call Screen -->
{#if callState === 'outgoing'}
    <div style="display: flex; flex-direction: column; align-items: center;">
        <p>Calling...</p>
        <button on:click={handleEndCall} style="padding: 10px 20px; font-size: 16px; background-color: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;" aria-label="Cancel Call">
            Cancel Call
        </button>
    </div>
{/if}

<!-- Incoming Call Screen -->
{#if callState === 'incoming'}
    <div style="display: flex; flex-direction: column; align-items: center;">
        <p>Incoming Call...</p>
        <button on:click={handleAnswerCall} style="padding: 10px 20px; font-size: 16px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;" aria-label="Answer Call">
            Answer
        </button>
        <button on:click={handleEndCall} style="padding: 10px 20px; font-size: 16px; background-color: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;" aria-label="Decline Call">
            Decline
        </button>
    </div>
{/if}

<!-- Ongoing Call Screen -->
{#if callState === 'connected'}
    <div style="display: flex; flex-direction: column; align-items: center; padding: 10px; background: #eee; border: 1px solid #ddd;">
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
            <!-- Local audio -->
            <div style="flex: 1;">
                <audio
                    bind:this={localAudio}
                    autoplay
                    muted
                    style="width: 100%; border: 1px solid #ccc; border-radius: 5px;"
                    aria-label="Local audio"
                ></audio>
            </div>

            <!-- Remote audio -->
            <div style="flex: 1;">
                <audio
                    bind:this={remoteAudio}
                    autoplay
                    style="width: 100%; border: 1px solid #ccc; border-radius: 5px;"
                    aria-label="Remote audio"
                ></audio>
            </div>
        </div>

        <!-- Call Control Buttons -->
        <div style="display: flex; gap: 10px; margin-top: 10px;">
            <button on:click={toggleMute} style="padding: 10px 20px; font-size: 16px; background-color: #f0ad4e; color: white; border: none; border-radius: 5px; cursor: pointer;" aria-label="Toggle Mute">
                🎤 Mute/Unmute
            </button>
            <button on:click={handleEndCall} style="padding: 10px 20px; font-size: 16px; background-color: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;" aria-label="End Call">
                End Call
            </button>
        </div>

        <!-- Call Timer -->
        <p>Call Duration: {minutes}:{seconds < 10 ? '0' : ''}{seconds}</p>
    </div>
{/if}
