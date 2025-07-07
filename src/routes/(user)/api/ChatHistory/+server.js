import { json } from '@sveltejs/kit';
import { openDB, getChatHistory } from '$lib/data/database';

let db;

export async function GET({ request }) {
	if (!db) {
		db = await openDB();
	}

	const url = new URL(request.url);
	const roomId = url.searchParams.get('roomId');

	if (!roomId) {
		return new Response('Room ID is required', { status: 400 });
	}

	try {
		const history = await getChatHistory(roomId);
		return json(history);
	} catch (error) {
		console.error(error);
		return new Response('Internal server error', { status: 500 });
	}
}
