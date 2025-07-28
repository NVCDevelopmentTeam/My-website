declare global {
	interface Window {
		webkitSpeechRecognition: typeof SpeechRecognition;
		webkitAudioContext: typeof AudioContext;
		responsiveVoice: any;
	}
}

export {};
