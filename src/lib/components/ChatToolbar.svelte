<script>
import VideoCall from '$lib/components/VideoCall.svelte';
import VoiceCall from '$lib/components/VoiceCall.svelte';
    export let peer;
    export let peerId;
    export let handleRemoteStream;

    // Handle starting a voice call
    function startVoiceCall() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                if (peer && peerId) {
                    const call = peer.call(peerId, stream);  // Call another peer using their peerId
                    call.on('stream', remoteStream => {
                        // Handle the incoming stream from the remote peer
                        handleRemoteStream(remoteStream);
                    });
                } else {
                    console.error('Peer or peerId is not defined.');
                }
            }).catch(error => {
                console.error('Failed to start voice call:', error);
            });
    }

    // Handle starting a video call
    function startVideoCall() {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                if (peer && peerId) {
                    const call = peer.call(peerId, stream);  // Call another peer using their peerId
                    call.on('stream', remoteStream => {
                        // Handle the incoming stream from the remote peer
                        handleRemoteStream(remoteStream);
                    });
                } else {
                    console.error('Peer or peerId is not defined.');
                }
            }).catch(error => {
                console.error('Failed to start video call:', error);
            });
    }
</script>

<!-- Toolbar with buttons for voice and video calls -->
<div>
<VoiceCall />
<VideoCall />
</div>
