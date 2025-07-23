import { json } from '@sveltejs/kit';
import { openDB, getChatHistory } from '$lib/data/database';
import { v4 as uuidv4 } from 'uuid';

let db;
const TIMEOUT_MS = 5000;
const requestCounts = new Map();

// Rate limiting helper
function checkRateLimit(roomId) {
	const now = Date.now();
	const recentRequests = requestCounts.get(roomId) || [];
	const validRequests = recentRequests.filter((time) => now - time < 60000);
	requestCounts.set(roomId, validRequests);
	return validRequests.length >= 100; // 100 requests per minute limit
}

export async function GET({ request }) {
	try {
		// Initialize DB with timeout
		if (!db) {
			db = await Promise.race([
				openDB(),
				new Promise((_, reject) =>
					setTimeout(() => reject(new Error('Database connection timeout')), TIMEOUT_MS)
				)
			]);
		}

		const url = new URL(request.url);
		const roomId = url.searchParams.get('roomId');

		// Input validation
		if (!roomId || typeof roomId !== 'string' || roomId.length > 100) {
			return json(
				{
					error: 'Invalid Room ID format',
					details: 'Room ID must be a non-empty string less than 100 characters'
				},
				{ status: 400 }
			);
		}

		// Rate limiting
		if (checkRateLimit(roomId)) {
			return json(
				{
					error: 'Rate limit exceeded',
					details: 'Too many requests for this room ID'
				},
				{ status: 429 }
			);
		}

		// Add request timestamp for rate limiting
		requestCounts.get(roomId)?.push(Date.now());

		// Get chat history with timeout
		const history = await Promise.race([
			getChatHistory(roomId),
			new Promise((_, reject) =>
				setTimeout(() => reject(new Error('Request timeout')), TIMEOUT_MS)
			)
		]);

		if (!history) {
			return json(
				{
					error: 'No history found',
					roomId
				},
				{ status: 404 }
			);
		}

		return json(
			{
				success: true,
				data: history,
				timestamp: new Date().toISOString()
			},
			{
				headers: {
					'Cache-Control': 'no-cache',
					'X-Request-ID': uuidv4()
				}
			}
		);
	} catch (error) {
		console.error('Chat history error:', error);

		const errorResponse = {
			error: 'Internal server error',
			details: process.env.NODE_ENV === 'development' ? error.message : undefined,
			requestId: uuidv4()
		};

		return json(errorResponse, {
			status: error.message.includes('timeout') ? 504 : 500,
			headers: { 'X-Request-ID': errorResponse.requestId }
		});
	}
}
