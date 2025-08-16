<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	/**
	 * @typedef {Object} Props
	 * @property {string} [title] - Initialize variables - Title of the article
	 * @property {string} [postContent] - Main content of the article
	 */

	/** @type {Props} */
	let { title = '', postContent = '' } = $props();

	let isSpeaking = $state(false); // Track if content is being spoken
	let responsiveVoiceReady = $state(false); // Flag to check if ResponsiveVoice is ready
	let speechRate = $state(1); // Speech rate (default is 1)
	let isMuted = $state(false); // Mute state
	let selectedVoice = $state(''); // Currently selected voice
	let voices = $state([]); // List of available voices
	let progress = $state(0); // Progress of the speech
	let speechDuration = 0; // Estimated duration of speech
	let intervalId; // ID for progress interval
	let isRateMenuOpen = $state(false); // State for showing/hiding speech rate dropdown

	let speechText = $derived(`${title}. ${postContent}`); // Combine title and content

	// On component mount
	onMount(() => {
		if (browser && window.responsiveVoice) {
			responsiveVoiceReady = true;
			voices = window.responsiveVoice
				.getVoices()
				.filter((voice) => voice.name === 'Vietnamese Female' || voice.name === 'Vietnamese Male');
			if (voices.length > 0) {
				selectedVoice =
					voices.find((voice) => voice.name === 'Vietnamese Male')?.name || voices[0].name;
			} else {
				console.error('No Vietnamese voices available.');
			}
		} else if (browser) {
			console.error('ResponsiveVoice is not available.');
		}

		// Cleanup on component unmount
		return () => {
			if (isSpeaking) {
				stopSpeech();
			}
		};
	});

	// Start or resume speech
	function startSpeech() {
		if (responsiveVoiceReady && speechText && !isSpeaking && selectedVoice) {
			const textToRead = speechText.substring(Math.floor(progress * speechText.length));
			window.responsiveVoice.speak(textToRead, selectedVoice, {
				rate: speechRate,
				volume: isMuted ? 0 : 1,
				onstart: () => {
					isSpeaking = true;
					speechDuration = textToRead.length / (speechRate * 5); // Estimate based on rate
					updateProgress();
				},
				onend: () => {
					isSpeaking = false;
					resetProgress();
				}
			});
		} else if (!selectedVoice) {
			console.error('No voice selected.');
		}
	}

	// Stop speech
	function stopSpeech() {
		if (isSpeaking) {
			window.responsiveVoice.cancel();
			isSpeaking = false;
			clearInterval(intervalId);
		}
	}

	// Toggle between play and pause
	function toggleSpeech() {
		if (isSpeaking) {
			stopSpeech();
		} else {
			startSpeech();
		}
	}

	// Mute/unmute and apply instantly
	function toggleMute() {
		isMuted = !isMuted;
		if (isSpeaking) {
			stopSpeech();
			startSpeech(); // Restart speech to apply mute/unmute
		}
	}

	// Change speech rate and apply instantly
	function handleRateChange(rate) {
		speechRate = rate;
		if (isSpeaking) {
			stopSpeech();
			startSpeech(); // Restart speech to apply new rate
		}
		isRateMenuOpen = false;
	}

	// Change selected voice
	function handleVoiceChange(event) {
		selectedVoice = event.target.value;
		if (isSpeaking) {
			stopSpeech();
			startSpeech(); // Restart speech to apply new voice
		}
	}

	// Update progress of speech at intervals
	function updateProgress() {
		clearInterval(intervalId);
		intervalId = setInterval(() => {
			progress += 1 / speechDuration;
			if (progress >= 1) {
				progress = 1;
				clearInterval(intervalId);
			}
		}, 1000);
	}

	// Reset progress and clear interval
	function resetProgress() {
		progress = 0;
		clearInterval(intervalId);
	}

	// Fast forward or rewind by 10 seconds
	function seek(seconds) {
		if (isSpeaking) {
			stopSpeech();
			progress += seconds / speechDuration;
			if (progress < 0) progress = 0;
			if (progress > 1) progress = 1;
			const newPosition = Math.floor(progress * speechText.length);
			const newSpeechText = speechText.substring(newPosition);
			window.responsiveVoice.speak(newSpeechText, selectedVoice, {
				rate: speechRate,
				volume: isMuted ? 0 : 1,
				onstart: () => {
					isSpeaking = true;
					speechDuration = newSpeechText.length / (speechRate * 5); // Recalculate duration
					updateProgress();
				},
				onend: () => {
					isSpeaking = false;
					resetProgress();
				}
			});
		}
	}

	// Handle manual progress change via slider
	function handleProgressChange(event) {
		const newProgress = parseFloat(event.target.value);
		if (isSpeaking) {
			stopSpeech();
			progress = newProgress;
			const newPosition = Math.floor(progress * speechText.length);
			const newSpeechText = speechText.substring(newPosition);
			window.responsiveVoice.speak(newSpeechText, selectedVoice, {
				rate: speechRate,
				volume: isMuted ? 0 : 1,
				onstart: () => {
					isSpeaking = true;
					speechDuration = newSpeechText.length / (speechRate * 5);
					updateProgress();
				},
				onend: () => {
					isSpeaking = false;
					resetProgress();
				}
			});
		} else {
			progress = newProgress;
		}
	}
</script>

<!-- UI Components -->
<div class="text-to-speech p-4 bg-white rounded-lg shadow-md">
	<div class="controls flex flex-wrap gap-2 mb-4">
		<!-- Play/Pause Button -->
		<button
			onclick={toggleSpeech}
			disabled={!responsiveVoiceReady || voices.length === 0}
			class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
		>
			{isSpeaking ? 'Pause' : 'Play'}
		</button>

		<!-- Mute/Unmute Button -->
		<button
			onclick={toggleMute}
			class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
		>
			{isMuted ? 'Unmute' : 'Mute'}
		</button>

		<!-- Rewind and Fast Forward Buttons -->
		<button
			onclick={() => seek(-10)}
			disabled={!responsiveVoiceReady || voices.length === 0}
			class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
		>
			Rewind 10s
		</button>
		<button
			onclick={() => seek(10)}
			disabled={!responsiveVoiceReady || voices.length === 0}
			class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
		>
			Forward 10s
		</button>
	</div>

	<!-- Speech Rate Dropdown -->
	<div class="rate-control flex items-center gap-2 mb-4">
		<label for="speechRate" class="text-gray-700 font-medium">Speech Rate:</label>
		<div class="dropdown relative">
			<button
				onclick={() => (isRateMenuOpen = !isRateMenuOpen)}
				class="px-3 py-1 bg-gray-100 rounded border border-gray-300 hover:bg-gray-200 transition-colors"
			>
				{speechRate}x
			</button>
			{#if isRateMenuOpen}
				<div
					class="dropdown-menu absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10"
				>
					{#each [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as rate}
						<button
							onclick={() => handleRateChange(rate)}
							class="block w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
						>
							{rate}x
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- Voice Selection -->
	<div class="voice-select flex items-center gap-2 mb-4">
		<label for="voiceSelect" class="text-gray-700 font-medium">Voice:</label>
		<select
			id="voiceSelect"
			onchange={handleVoiceChange}
			bind:value={selectedVoice}
			disabled={!responsiveVoiceReady || voices.length === 0}
			class="px-3 py-1 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
		>
			{#each voices as voice}
				<option value={voice.name}>{voice.name}</option>
			{/each}
		</select>
	</div>

	<!-- Progress Slider -->
	<div class="progress-control">
		<label for="progressRange" class="text-gray-700 font-medium block mb-2">Progress:</label>
		<input
			id="progressRange"
			type="range"
			min="0"
			max="1"
			step="0.01"
			bind:value={progress}
			oninput={handleProgressChange}
			class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
		/>
	</div>
</div>
