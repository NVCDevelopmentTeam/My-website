<script>
  import { onDestroy } from 'svelte';

  
  /**
   * @typedef {Object} Props
   * @property {any} socket - Declare props for socket and roomId
   * @property {any} roomId
   */

  /** @type {Props} */
  let { socket, roomId } = $props();

  // Reactive state variables
  let localStream = $state(null); // Stream of the local user's video and audio
  let remoteStream = $state(null); // Stream of the remote user's video and audio
  let localVideoElement = $state();
  let remoteVideoElement = $state();

  // Custom action to handle setting video stream to the element
  function streamAction(node, stream) {
    if (stream) {
      node.srcObject = stream; // Set the video stream to the video element
    }
    return {
      update(newStream) {
        if (newStream) {
          node.srcObject = newStream;
        }
      },
      destroy() {
        node.srcObject = null;
      }
    };
  }

  // WebRTC PeerConnection configuration
  let peerConnection;
  const config = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' }, // Google STUN server for NAT traversal
    ],
  };

  // Start the video call (get user media and establish connection)
  async function startCall() {
    try {
      // Get video and audio streams from the local device
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Create a new peer connection for the local user
      peerConnection = new RTCPeerConnection(config);

      // Add local stream tracks to the peer connection
      localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', event.candidate, roomId); // Send ICE candidate to the server
        }
      };

      // Handle incoming remote stream
      peerConnection.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          remoteStream = event.streams[0]; // Set the remote video stream
        }
      };

      // Create an offer to start the call
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      // Send the offer to the server (to the remote user)
      socket.emit('call-offer', { offer, roomId });
    } catch (error) {
      console.error('Error starting call:', error);
    }
  }

  // Handle incoming call offer from the remote user
  socket.on('call-offer', async (data) => {
    try {
      // Set the remote description from the received offer
      await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));

      // Create an answer to the offer
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      // Send the answer back to the caller
      socket.emit('call-answer', { answer, roomId });
    } catch (error) {
      console.error('Error handling call offer:', error);
    }
  });

  // Handle incoming call answer from the caller
  socket.on('call-answer', async (data) => {
    try {
      // Set the remote description from the received answer
      await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
    } catch (error) {
      console.error('Error handling call answer:', error);
    }
  });

  // Handle incoming ICE candidate from the server
  socket.on('ice-candidate', async (candidate) => {
    try {
      // Add the received ICE candidate to the peer connection
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  });

  // Cleanup when the component is destroyed (close peer connection and stop streams)
  onDestroy(() => {
    if (peerConnection) {
      peerConnection.close(); // Close the peer connection
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop()); // Stop all tracks of the local stream
    }
  });
</script>

<!-- Video Call UI -->
<div class="video-call">
  {#if localStream}
    <video
      class="local-video"
      autoplay
      muted
      use:streamAction={localStream}
      bind:this={localVideoElement}
    >
      <track kind="captions" />
    </video>
  {/if}
  {#if remoteStream}
    <video
      class="remote-video"
      autoplay
      use:streamAction={remoteStream}
      bind:this={remoteVideoElement}
    >
      <track kind="captions" />
    </video>
  {/if}
  <button onclick={startCall}>Start Video Call</button>
</div>
