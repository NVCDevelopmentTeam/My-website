<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  
  /**
   * @typedef {Object} Props
   * @property {string} [title] - Initialize variables
   * @property {string} [postContent]
   */

  /** @type {Props} */
  let { title = '', postContent = '' } = $props();

  let isSpeaking = $state(false);
  let responsiveVoiceReady = $state(false);
  let speechRate = $state(1);
  let volume = $state(1);
  let isMuted = $state(false);
  let selectedVoice = $state('');
  let voices = $state([]);
  let progress = $state(0);
  let speechDuration = 0;
  let intervalId;
  let isRateMenuOpen = $state(false);

  let speechText = $derived(`${title}. ${postContent}`);

  // On component mount
  onMount(() => {
    if (browser && window.responsiveVoice) {
      responsiveVoiceReady = true;
      voices = window.responsiveVoice.getVoices().filter(voice =>
        voice.name === 'Vietnamese Female' || voice.name === 'Vietnamese Male'
      );
      if (voices.length > 0) {
        selectedVoice = voices.find(voice => voice.name === 'Vietnamese Male')?.name || voices[0].name;
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
        volume: isMuted ? 0 : volume,
        onstart: () => {
          isSpeaking = true;
          speechDuration = textToRead.length / (speechRate * 5);
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
</script>

<!-- UI Components -->
<div class="text-to-speech">
  <div class="controls">
    <!-- Play/Pause Button -->
    <button onclick={toggleSpeech} disabled={!responsiveVoiceReady || voices.length === 0}>
      {isSpeaking ? 'Pause' : 'Play'}
    </button>

    <!-- Mute/Unmute Button -->
    <button onclick={toggleMute}>
      {isMuted ? 'Unmute' : 'Mute'}
    </button>

    <!-- Rewind and Fast Forward Buttons -->
    <button onclick={() => seek(-10)} disabled={!responsiveVoiceReady || voices.length === 0}>
      Rewind 10s
    </button>
    <button onclick={() => seek(10)} disabled={!responsiveVoiceReady || voices.length === 0}>
      Forward 10s
    </button>
  </div>

  <!-- Speech Rate Dropdown -->
  <div class="rate-control">
    <label for="speechRate">Speech Rate:</label>
    <div class="dropdown">
      <button onclick={() => isRateMenuOpen = !isRateMenuOpen}>
        {speechRate}x
      </button>
      {#if isRateMenuOpen}
        <div class="dropdown-menu">
          {#each [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as rate}
            <button onclick={() => handleRateChange(rate)}>{rate}x</button>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <!-- Volume Control -->
  <div class="volume-control">
    <label for="volumeRange">Volume:</label>
    <input
      id="volumeRange"
      type="range"
      min="0"
      max="1"
      step="0.01"
      bind:value={volume}
      oninput={handleVolumeChange}
    />
  </div>

  <!-- Voice Selection -->
  <div class="voice-select">
    <label for="voiceSelect">Voice:</label>
    <select
      id="voiceSelect"
      onchange={handleVoiceChange}
      bind:value={selectedVoice}
      disabled={!responsiveVoiceReady || voices.length === 0}
    >
      {#each voices as voice}
        <option value={voice.name}>{voice.name}</option>
      {/each}
    </select>
  </div>

  <!-- Progress Slider -->
  <div class="progress-control">
    <label for="progressRange">Progress:</label>
    <input
      id="progressRange"
      type="range"
      min="0"
      max="1"
      step="0.01"
      bind:value={progress}
      oninput={handleProgressChange}
    />
  </div>
</div>

<style>
  .text-to-speech {
    /* Add your styles here */
  }
  .controls {
    display: flex;
    gap: 10px;
  }
  .rate-control, .volume-control, .voice-select, .progress-control {
    margin-top: 10px;
  }
  .dropdown {
    position: relative;
  }
  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: white;
    border: 1px solid #ccc;
    padding: 5px;
  }
</style>