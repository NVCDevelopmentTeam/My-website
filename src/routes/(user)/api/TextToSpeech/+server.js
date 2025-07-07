import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
	try {
		const { text, voice = 'en-US', pitch = 1, rate = 1 } = await request.json();

		if (!text) {
			return json({ error: 'Text is required' }, { status: 400 });
		}

		// Convert text to audio using a free TTS service
		const audioContent = await textToSpeech(text, voice, pitch, rate);

		return new Response(audioContent, {
			headers: {
				'Content-Type': 'audio/mpeg',
				'Content-Disposition': 'attachment; filename="speech.mp3"'
			}
		});
	} catch (error) {
		console.error('TTS Error:', error);
		return json({ error: 'Text to speech conversion failed' }, { status: 500 });
	}
};

async function textToSpeech(text, voice, pitch, rate) {
	// Using Google Translate TTS as a free solution
	const url = new URL('https://translate.google.com/translate_tts');
	url.searchParams.append('ie', 'UTF-8');
	url.searchParams.append('q', text);
	url.searchParams.append('tl', voice);
	url.searchParams.append('client', 'tw-ob');

	const response = await fetch(url.toString(), {
		headers: {
			Referer: 'https://translate.google.com/',
			'User-Agent': 'Mozilla/5.0'
		}
	});

	if (!response.ok) {
		throw new Error('TTS request failed');
	}

	return response.arrayBuffer();
}
