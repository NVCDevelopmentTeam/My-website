<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	const { title, postContent } = $props();

	let isSpeaking = $state(false);
	let responsiveVoiceReady = $state(false);
	let speechRate = $state(1);
	let volume = $state(1);
	let isMuted = $state(false);
	let selectedVoice = $state('');
	let voices = $state([]);
	let isVoiceSelectDisabled = $derived(!responsiveVoiceReady || voices.length === 0);
	let progress = $state(0);
	let speechDuration = 0;
	let intervalId;
	let isRateMenuOpen = $state(false);
	let rateMenuRef = $state(null); // Reference to the rate menu div

	let speechText = $derived(`${title}. ${postContent}`);

	// On component mount
	onMount(() => {
		if (browser) {
			// Check if responsiveVoice is already loaded
			if (window.responsiveVoice) {
				initializeResponsiveVoice();
			} else {
				// Wait for responsiveVoice to be loaded
				const checkResponsiveVoice = setInterval(() => {
					if (window.responsiveVoice) {
						clearInterval(checkResponsiveVoice);
						initializeResponsiveVoice();
					}
				}, 100);
			}
		}

		// Cleanup on component unmount
		return () => {
			if (isSpeaking) {
				stopSpeech();
			}
		};
	});

	function initializeResponsiveVoice() {
		responsiveVoiceReady = true;
		voices = window.responsiveVoice
			.getVoices()
			.filter((voice) => voice.name.includes('Vietnamese')); // More general filter
		if (voices.length > 0) {
			selectedVoice =
				voices.find((voice) => voice.name === 'Vietnamese Male')?.name || voices[0].name;
		} else {
			console.warn('No Vietnamese voices available. Using default responsiveVoice behavior.');
		}
	}

	// Start or resume speech
	function startSpeech() {
		if (responsiveVoiceReady && speechText && !isSpeaking && selectedVoice) {
			const textToRead = speechText.substring(Math.floor(progress * speechText.length));
			// Estimate speech duration more accurately based on characters and rate
			speechDuration = textToRead.length / (speechRate * 15); // Adjust multiplier as needed for better accuracy

			window.responsiveVoice.speak(textToRead, selectedVoice, {
				rate: speechRate,
				volume: isMuted ? 0 : volume,
				onstart: () => {
					isSpeaking = true;
					updateProgress();
				},
				onend: () => {
					isSpeaking = false;
					resetProgress();
				}
			});
		} else if (!selectedVoice) {
			console.warn('No voice selected. Speech will not start.');
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
			startSpeech();
		}
	}

	// Change speech rate and apply instantly
	function handleRateChange(rate) {
		speechRate = rate;
		if (isSpeaking) {
			stopSpeech();
			startSpeech();
		}
		isRateMenuOpen = false;
	}

	// Change selected voice
	function handleVoiceChange(event) {
		selectedVoice = event.target.value;
		if (isSpeaking) {
			stopSpeech();
			startSpeech();
		}
	}

	// Update progress of speech at intervals
	function updateProgress() {
		clearInterval(intervalId);
		intervalId = setInterval(() => {
			progress += 1 / ((speechDuration * 1000) / 100); // Update progress more smoothly
			if (progress >= 1) {
				progress = 1;
				clearInterval(intervalId);
			}
		}, 100); // Update every 100ms
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
			startSpeech();
		}
	}

	// Handle manual progress change via slider
	function handleProgressChange(event) {
		const newProgress = parseFloat(event.target.value);
		if (isSpeaking) {
			stopSpeech();
			progress = newProgress;
			startSpeech();
		} else {
			progress = newProgress;
		}
	}

	// Handle volume change
	function handleVolumeChange(event) {
		volume = parseFloat(event.target.value);
		if (isSpeaking) {
			stopSpeech();
			startSpeech();
		}
	}

	// Click outside handler for rate menu
	function handleClickOutsideRateMenu(event) {
		if (rateMenuRef && !rateMenuRef.contains(event.target)) {
			isRateMenuOpen = false;
		}
	}
</script>

<svelte:window on:click={handleClickOutsideRateMenu} />

<!-- UI Components -->
<div class="p-4 bg-card rounded-lg shadow-md space-y-4">
	<div class="flex flex-wrap gap-2">
		<!-- Play/Pause Button -->
		<button
			onclick={toggleSpeech}
			disabled={isVoiceSelectDisabled}
			class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
		>
			{isSpeaking ? 'Pause' : 'Play'}
		</button>

		<!-- Mute/Unmute Button -->
		<button
			onclick={toggleMute}
			class="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
		>
			{isMuted ? 'Unmute' : 'Mute'}
		</button>

		<!-- Rewind and Fast Forward Buttons -->
		<button
			onclick={() => seek(-10)}
			disabled={isVoiceSelectDisabled}
			class="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 disabled:opacity-50"
		>
			Rewind 10s
		</button>
		<button
			onclick={() => seek(10)}
			disabled={isVoiceSelectDisabled}
			class="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 disabled:opacity-50"
		>
			Forward 10s
		</button>
	</div>

	<!-- Speech Rate Dropdown -->
	<div class="rate-control flex items-center space-x-2">
		<label for="speechRate" class="font-medium">Speech Rate:</label>
		<div class="relative inline-block text-left" bind:this={rateMenuRef}>
			<button
				onclick={() => (isRateMenuOpen = !isRateMenuOpen)}
				class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				{speechRate}x
			</button>
			{#if isRateMenuOpen}
				<div
					class="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
				>
					{#each [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as rate (rate)}
						<button
							onclick={() => handleRateChange(rate)}
							class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
							>{rate}x</button
						>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- Volume Control -->
	<div class="volume-control flex items-center space-x-2">
		<label for="volumeRange" class="font-medium">Volume:</label>
		<input
			id="volumeRange"
			type="range"
			min="0"
			max="1"
			step="0.01"
			bind:value={volume}
			oninput={handleVolumeChange}
			class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
		/>
	</div>

	<!-- Voice Selection -->
	<div class="voice-select flex items-center space-x-2">
		<label for="voiceSelect" class="font-medium">Voice:</label>
		<select
			id="voiceSelect"
			onchange={handleVoiceChange}
			bind:value={selectedVoice}
			disabled={isVoiceSelectDisabled}
			class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
		>
			{#each voices as voice (voice.name)}
				<option value={voice.name}>{voice.name}</option>
			{/each}
		</select>
	</div>

	<!-- Progress Slider -->
	<div class="progress-control flex items-center space-x-2">
		<label for="progressRange" class="font-medium">Progress:</label>
		<input
			id="progressRange"
			type="range"
			min="0"
			max="1"
			step="0.01"
			bind:value={progress}
			oninput={handleProgressChange}
			class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
		/>
	</div>
</div>

<style>
	.rate-control,
	.volume-control,
	.voice-select,
	.progress-control {
		margin-top: 10px;
	}
</style>
