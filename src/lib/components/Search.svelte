<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import { searchQuery, searchResults, isLoading, noResults, search } from '$lib/data/search';
	import { browser } from '$app/environment';

	let voiceSearchSupported = $state(false);
	let recognition;
	let isListening = $state(false);
	let query = $state('');

	// Declare these variables
	let isVoiceSearch = $state(false); // This needs to be reactive
	let audioContext;
	let audioBuffers = {};
	const audioFilePath = '/src/lib/sounds';

	onMount(() => {
		if (browser) {
			voiceSearchSupported = 'webkitSpeechRecognition' in window;
			if (voiceSearchSupported) {
				setupVoiceRecognition();
			}
			initializeAudio();
			query = new URLSearchParams(window.location.search).get('q') || '';
			if (query && browser) {
				searchQuery.set(query);
				performSearch(query);
			}
		}
	});

	function setupVoiceRecognition() {
		recognition = new window.webkitSpeechRecognition();
		recognition.lang = 'Vi-VN';
		recognition.continuous = false;
		recognition.interimResults = false;

		recognition.onstart = () => {
			isListening = true;
			isVoiceSearch = true; // Indicate voice search started
			playAudio('start-search');
		};

		recognition.onresult = (event) => {
			const transcript = event.results[0][0].transcript;
			searchQuery.set(transcript);
			recognition.stop();
			performSearch(transcript);
		};

		recognition.onend = () => {
			isListening = false;
			if (!isVoiceSearch) return; // Ensure this block is only for voice search

			// Play stop sound when user manually stops voice search
			playAudio('error');

			// If no results were found and search was via voice
			if (!$searchResults.length && !noResults) {
				playAudio('error');
			}
			isVoiceSearch = false;
		};

		recognition.onerror = (event) => {
			isListening = false;
			console.error('Voice recognition error:', event.error);
			playAudio('error');
			isVoiceSearch = false;
		};
	}

	async function initializeAudio() {
		try {
			audioContext = new (window.AudioContext || window.webkitAudioContext)();
			const audioFiles = ['start-search', 'no-results', 'error', 'search-results', 'error'];

			for (const file of audioFiles) {
				const response = await fetch(`${audioFilePath}/${file}.mp3`);
				const arrayBuffer = await response.arrayBuffer();
				audioBuffers[file] = await audioContext.decodeAudioData(arrayBuffer);
			}
		} catch (error) {
			console.error('Error initializing audio:', error);
		}
	}

	function playAudio(audioType) {
		if (audioContext && audioBuffers[audioType]) {
			const source = audioContext.createBufferSource();
			source.buffer = audioBuffers[audioType];
			source.connect(audioContext.destination);
			source.start();
		}
	}

	async function performSearch(queryText) {
		const trimmedQuery = queryText.trim();
		if (!trimmedQuery) {
			alert('Please enter search keywords.');
			return;
		}

		try {
			isLoading.set(true);
			await search(trimmedQuery);

			if (isVoiceSearch) {
				// Play sound only for voice search results
				if ($searchResults.length > 0) {
					playAudio('search-results');
				} else {
					playAudio('no-results');
				}
			}

			await goto(`/search-results?q=${encodeURIComponent(trimmedQuery)}`, { replaceState: true });
		} catch (error) {
			console.error('Error performing search:', error);
			if (isVoiceSearch) playAudio('error');
		} finally {
			isLoading.set(false);
			isVoiceSearch = false; // Reset voice search flag after search
		}
	}

	function handleSubmit(event) {
		event.preventDefault();
		isVoiceSearch = false; // Indicate this is text search
		performSearch($searchQuery);
	}

	function handleVoiceSearch() {
		if (!voiceSearchSupported || !recognition) {
			alert('Your browser does not support voice search.');
			return;
		}

		if (isListening) {
			recognition.stop();
		} else {
			searchQuery.set('');
			recognition.start();
		}
	}
</script>

<div class="relative w-full max-w-md">
	<form onsubmit={handleSubmit} class="relative">
		<input
			class="w-full px-4 py-2 pr-10 border rounded-md bg-input text-foreground focus:ring-primary focus:border-primary"
			type="text"
			name="search"
			id="search"
			aria-label="Search"
			bind:value={$searchQuery}
			placeholder="Enter keyword..."
			autocomplete="off"
		/>
		<div class="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
			{#if voiceSearchSupported}
				<button
					type="button"
					class="p-1 rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
					title={isListening ? 'Stop voice search' : 'Voice search'}
					aria-label={isListening ? 'Stop voice search' : 'Voice search'}
					onclick={handleVoiceSearch}
				>
					<svg
						class:animate-pulse={isListening}
						class="w-5 h-5 {isListening ? 'text-primary' : 'text-muted-foreground'}"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
						<path
							d="M5.5 4.5a.5.5 0 01.5-.5h8a.5.5 0 010 1h-8a.5.5 0 01-.5-.5zM10 18a7 7 0 007-7h-2a5 5 0 01-5 5v2z"
						/>
					</svg>
				</button>
			{/if}
			<button
				type="submit"
				class="p-1 rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
				title="Search"
				aria-label="Search"
				disabled={$isLoading}
			>
				<svg class="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>
	</form>
</div>
