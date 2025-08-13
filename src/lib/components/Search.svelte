<script>
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let query = $state('');
	let isLoading = $state(false);
	let isListening = $state(false);
	let recognition = null;
	let voiceSearchSupported = $state(false);

	onMount(() => {
		if (browser) {
			// Check for Web Speech API support
			voiceSearchSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
			
			if (voiceSearchSupported) {
				const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
				recognition = new SpeechRecognition();
				
				recognition.continuous = false;
				recognition.interimResults = false;
				recognition.lang = 'vi-VN'; // Vietnamese language
				
				recognition.onstart = () => {
					isListening = true;
					playSound('voice-start');
					announceToScreenReader('Đang nghe giọng nói...');
				};
				
				recognition.onresult = (event) => {
					const transcript = event.results[0][0].transcript;
					query = transcript;
					playSound('voice-end');
					announceToScreenReader(`Đã nhận được: ${transcript}`);
					performSearch(transcript);
				};
				
				recognition.onerror = (event) => {
					console.error('Speech recognition error:', event.error);
					isListening = false;
					playSound('voice-error');
					announceToScreenReader('Lỗi nhận dạng giọng nói. Vui lòng thử lại.');
				};
				
				recognition.onend = () => {
					isListening = false;
				};
			}
		}
	});

	async function playSound(soundName) {
		if (!browser) return;
		
		try {
			const audio = new Audio(`/src/lib/sounds/${soundName}.mp3`);
			audio.volume = 0.5;
			await audio.play();
		} catch (error) {
			console.warn('Could not play sound:', error);
		}
	}

	function announceToScreenReader(message) {
		if (!browser) return;
		
		// Create or update live region for screen reader announcements
		let liveRegion = document.getElementById('search-live-region');
		if (!liveRegion) {
			liveRegion = document.createElement('div');
			liveRegion.id = 'search-live-region';
			liveRegion.setAttribute('aria-live', 'polite');
			liveRegion.setAttribute('aria-atomic', 'true');
			liveRegion.className = 'sr-only';
			document.body.appendChild(liveRegion);
		}
		
		liveRegion.textContent = message;
	}

	function startVoiceSearch() {
		if (!voiceSearchSupported || !recognition) {
			alert('Trình duyệt của bạn không hỗ trợ tìm kiếm bằng giọng nói.');
			announceToScreenReader('Tìm kiếm bằng giọng nói không được hỗ trợ.');
			return;
		}
		
		if (isListening) {
			recognition.stop();
			announceToScreenReader('Đã dừng nghe giọng nói.');
		} else {
			recognition.start();
		}
	}

	async function performSearch(queryText) {
		const trimmedQuery = queryText.trim();
		if (!trimmedQuery) {
			// Enhanced alert with better accessibility
			const message = 'Vui lòng nhập từ khóa tìm kiếm trước khi thực hiện tìm kiếm.';
			alert(message);
			announceToScreenReader(message);
			
			// Focus back to search input
			const searchInput = document.getElementById('search');
			if (searchInput) {
				searchInput.focus();
			}
			return;
		}

		try {
			isLoading = true;
			announceToScreenReader(`Đang tìm kiếm: ${trimmedQuery}`);
			// Navigate to the existing Search-results page
			await goto(`/Search-results?q=${encodeURIComponent(trimmedQuery)}`, { replaceState: false });
		} catch (error) {
			console.error('Error performing search:', error);
			const errorMessage = 'Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.';
			alert(errorMessage);
			announceToScreenReader(errorMessage);
		} finally {
			isLoading = false;
		}
	}

	function handleSubmit(event) {
		event.preventDefault();
		performSearch(query);
	}

	function handleKeydown(event) {
		if (event.key === 'Escape') {
			query = '';
			announceToScreenReader('Đã xóa nội dung tìm kiếm.');
		}
	}
</script>

<div class="relative w-full max-w-md">
	<form onsubmit={handleSubmit} class="relative">
		<div class="relative flex items-center">
			<input
				class="w-full px-4 py-2 pr-20 border rounded-md bg-input text-foreground focus:ring-primary focus:border-primary transition-all duration-200"
				type="search"
				name="search"
				id="search"
				aria-label="Tìm kiếm"
				aria-describedby="search-help"
				bind:value={query}
				placeholder="Nhập từ khóa tìm kiếm..."
				autocomplete="off"
				on:keydown={handleKeydown}
			/>
			
			<!-- Voice search button -->
			{#if voiceSearchSupported}
				<button
					type="button"
					onclick={startVoiceSearch}
					class="absolute right-10 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-200 {isListening ? 'text-red-500 bg-red-50' : 'text-muted-foreground'}"
					aria-label={isListening ? 'Dừng tìm kiếm bằng giọng nói' : 'Tìm kiếm bằng giọng nói'}
					title={isListening ? 'Đang nghe...' : 'Tìm kiếm bằng giọng nói'}
					disabled={isLoading}
				>
					{#if isListening}
						<svg class="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
							<path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
						</svg>
					{:else}
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
						</svg>
					{/if}
				</button>
			{/if}

			<!-- Search button -->
			<div class="absolute inset-y-0 right-0 flex items-center pr-3">
				<button
					type="submit"
					class="p-1 rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-200"
					title="Tìm kiếm"
					aria-label="Thực hiện tìm kiếm"
					disabled={isLoading}
				>
					{#if isLoading}
						<svg class="w-5 h-5 text-muted-foreground animate-spin" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
					{:else}
						<svg class="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
								clip-rule="evenodd"
							/>
						</svg>
					{/if}
				</button>
			</div>
		</div>
	</form>

	<!-- Voice search status -->
	{#if isListening}
		<div class="absolute top-full left-0 right-0 mt-2 bg-red-50 border border-red-200 rounded-lg p-3 z-50 shadow-lg">
			<div class="flex items-center space-x-2">
				<svg class="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
					<path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
					<path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
				</svg>
				<span class="text-sm text-red-700 font-medium">Đang nghe... Hãy nói từ khóa tìm kiếm</span>
			</div>
		</div>
	{/if}

	<!-- Hidden help text for screen readers -->
	<div id="search-help" class="sr-only">
		Nhập từ khóa và nhấn Enter để tìm kiếm. 
		{#if voiceSearchSupported}
			Hoặc sử dụng nút microphone để tìm kiếm bằng giọng nói.
		{/if}
		Nhấn Escape để xóa nội dung.
	</div>
</div>

<style>
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
