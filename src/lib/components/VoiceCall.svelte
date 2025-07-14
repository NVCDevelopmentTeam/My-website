<script>
	// Props for socket and roomId

	// Reactive state variables
	let localStream = $state(null); // Tracks the local media stream
	let isMuted = $state(false); // Tracks whether the microphone is muted

	/**
	 * Starts the voice call by accessing the user's microphone.
	 */
	async function startCall() {
		try {
			localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
			console.log('Local stream initialized:', localStream);

			// TODO: Implement WebRTC logic here (e.g., signaling via socket)
		} catch (error) {
			console.error('Error starting call:', error);
		}
	}

	/**
	 * Toggles the mute state of the microphone.
	 */
	function toggleMute() {
		if (!localStream) return; // Ensure localStream is initialized before toggling

		isMuted = !isMuted;
		localStream.getAudioTracks().forEach((track) => (track.enabled = !isMuted));
	}
</script>

<!-- Voice Call UI -->
<div class="p-4 flex flex-col items-center space-y-4">
	<button
		onclick={startCall}
		class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
		>Start Voice Call</button
	>
	<button
		onclick={toggleMute}
		class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
	>
		{isMuted ? 'Unmute' : 'Mute'}
	</button>
</div>
