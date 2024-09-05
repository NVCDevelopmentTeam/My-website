<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  // Initialize variables
  export let title = '';
  export let postContent = '';

  let isSpeaking = false;
  let responsiveVoiceReady = false;
  let speechRate = 1;
  let isMuted = false;
  let selectedVoice = '';
  let voices = [];
  let progress = 0;
  let speechDuration = 0;
  let intervalId;
  let isRateMenuOpen = false;

  $: speechText = `${title}. ${postContent}`;

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
        volume: isMuted ? 0 : 1,
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
      resetProgress();
    }
  }

  // Toggle between start and stop speech
  function toggleSpeech() {
    if (isSpeaking) {
      stopSpeech();
    } else {
      startSpeech();
    }
  }

  // Toggle mute/unmute
  function toggleMute() {
    isMuted = !isMuted;
    if (isSpeaking) {
      stopSpeech();
      startSpeech(); // Restart speech to apply mute/unmute
    }
  }

  // Change speech rate
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

  // Update progress of speech
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

  // Reset progress
  function resetProgress() {
    progress = 0;
    clearInterval(intervalId);
  }

  // Seek forward or backward by 10 seconds
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
          speechDuration = newSpeechText.length / (speechRate * 5);
          updateProgress();
        },
        onend: () => {
          isSpeaking = false;
          resetProgress();
        }
      });
    }
  }

  // Handle progress change via slider
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

<div class="text-to-speech">
  <div class="controls">
    <button on:click={toggleSpeech} disabled={!responsiveVoiceReady || voices.length === 0}>
      {isSpeaking ? 'Pause' : 'Play'}
    </button>
    <button on:click={toggleMute}>
      {isMuted ? 'Unmute' : 'Mute'}
    </button>
    <button on:click={() => seek(-10)} disabled={!responsiveVoiceReady || voices.length === 0}>
      Rewind 10s
    </button>
    <button on:click={() => seek(10)} disabled={!responsiveVoiceReady || voices.length === 0}>
      Forward 10s
    </button>
  </div>

  <div class="rate-control">
    <label for="speechRate">Speech Rate:</label>
    <div class="dropdown">
      <button on:click={() => isRateMenuOpen = !isRateMenuOpen}>
        {speechRate}x
      </button>
      {#if isRateMenuOpen}
        <div class="dropdown-menu">
          {#each [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as rate}
            <button on:click={() => handleRateChange(rate)}>
              {rate}x
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <div class="voice-select">
    <label for="voiceSelect">Voice:</label>
    <select
      id="voiceSelect"
      on:change={handleVoiceChange}
      bind:value={selectedVoice}
      disabled={!responsiveVoiceReady || voices.length === 0}
    >
      {#each voices as voice}
        <option value={voice.name}>{voice.name}</option>
      {/each}
    </select>
  </div>

  <div class="progress-control">
    <label for="progressRange">Progress:</label>
    <input
      id="progressRange"
      type="range"
      min="0"
      max="1"
      step="0.01"
      bind:value={progress}
      on:input={handleProgressChange}
    />
  </div>
</div>
