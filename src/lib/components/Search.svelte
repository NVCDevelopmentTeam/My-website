<script>
	import { preventDefault } from 'svelte/legacy';

	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';
	import { searchQuery, isLoading, combinedSearch } from '$lib/data/search.js';

	let isListening = $state(false);
	let recognition = null;
	let voiceSearchSupported = $state(false);

	onMount(() => {
		if (browser) {
			const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
			if (SpeechRecognition) {
				voiceSearchSupported = true;
				recognition = new SpeechRecognition();
				recognition.continuous = false;
				recognition.interimResults = false;
				recognition.lang = 'vi-VN';

				recognition.onstart = () => {
					isListening = true;
					playSound('voice-start');
					announceToScreenReader('Bắt đầu nhận dạng giọng nói.');
				};

				recognition.onresult = (event) => {
					const transcript = event.results[0][0].transcript;
					$searchQuery = transcript;
					playSound('voice-end');
					announceToScreenReader(`Tìm kiếm cho: ${transcript}`);
				};

				recognition.onerror = (event) => {
					console.error('Speech recognition error:', event.error);
					isListening = false;
					playSound('voice-error');
					announceToScreenReader('Đã xảy ra lỗi khi nhận dạng giọng nói.');
				};

				recognition.onend = () => {
					isListening = false;
					announceToScreenReader('Kết thúc nhận dạng giọng nói.');
				};
			}
		}
	});

	onDestroy(() => {
		if (recognition) {
			recognition.stop();
		}
	});

	async function playSound(soundName) {
		if (!browser) return;
		try {
			// Assuming sounds are in the static folder
			const audio = new Audio(`/src/lib/sounds/${soundName}.mp3`);
			audio.volume = 0.3;
			await audio.play();
		} catch (error) {
			console.warn(`Could not play sound: ${soundName}`, error);
		}
	}

	function announceToScreenReader(message) {
		const liveRegion = document.getElementById('search-live-region');
		if (liveRegion) {
			liveRegion.textContent = message;
		}
	}

	function toggleVoiceSearch() {
		if (!voiceSearchSupported) {
			alert('Tìm kiếm bằng giọng nói không được trình duyệt này hỗ trợ.');
			return;
		}
		if (isListening) {
			recognition.stop();
		} else {
			recognition.start();
		}
	}

	function handleSubmit() {
		// The derived store `combinedSearch` handles the search automatically
		// when `searchQuery` is updated.
	}

	function handleKeydown(event) {
		if (event.key === 'Escape') {
			$searchQuery = '';
			announceToScreenReader('Đã xóa nội dung tìm kiếm.');
		}
	}
</script>

<div class="relative w-full max-w-lg mx-auto">
	<form onsubmit={preventDefault(handleSubmit)} class="relative group">
		<input
			type="search"
			name="search"
			id="search"
			bind:value={$searchQuery}
			onkeydown={handleKeydown}
			placeholder="Tìm kiếm bài viết, sản phẩm..."
			aria-label="Tìm kiếm"
			aria-describedby="search-help"
			autocomplete="off"
			class="w-full pl-4 pr-24 py-3 text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ease-in-out"
		/>

		<div class="absolute inset-y-0 right-0 flex items-center pr-3.5">
			{#if voiceSearchSupported}
				<button
					type="button"
					onclick={toggleVoiceSearch}
					disabled={$isLoading}
					aria-label={isListening ? 'Dừng nhận dạng giọng nói' : 'Bắt đầu nhận dạng giọng nói'}
					title={isListening ? 'Đang nghe...' : 'Tìm kiếm bằng giọng nói'}
					class="p-2 rounded-full transition-colors duration-200"
					class:text-red-500={isListening}
					class:hover:bg-gray-200={!isListening}
					class:dark:hover:bg-gray-700={!isListening}
					class:animate-pulse={isListening}
				>
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
						<path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
						<path
							d="M5.5 9.5a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zM12 11a2 2 0 10-4 0h4z"
						/>
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11a1 1 0 10-2 0v2a1 1 0 102 0V7zm4 0a1 1 0 10-2 0v2a1 1 0 102 0V7z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
			{/if}

			<button
				type="submit"
				disabled={$isLoading}
				aria-label="Tìm kiếm"
				class="p-2 ml-1 rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
			>
				{#if $isLoading}
					<svg
						class="w-5 h-5 animate-spin"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
				{:else}
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
							clip-rule="evenodd"
						/>
					</svg>
				{/if}
			</button>
		</div>
	</form>

	{#if isListening}
		<div
			class="absolute top-full left-0 right-0 mt-2 bg-red-50 border border-red-200 rounded-lg p-3 z-10 shadow-lg flex items-center space-x-2"
			role="status"
		>
			<svg class="w-5 h-5 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
				<path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
				<path
					d="M5.5 9.5a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zM12 11a2 2 0 10-4 0h4z"
				/>
			</svg>
			<span class="text-sm text-red-700 font-medium">Đang lắng nghe...</span>
		</div>
	{/if}

	<!-- Screen reader announcements -->
	<div id="search-live-region" class="sr-only" aria-live="polite" aria-atomic="true"></div>
	<p id="search-help" class="sr-only">
		Nhập từ khóa để tìm kiếm. Nhấn Escape để xóa.
		{#if voiceSearchSupported}
			Sử dụng nút micro để tìm kiếm bằng giọng nói.
		{/if}
	</p>
</div>
