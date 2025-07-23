import { updateStats } from '$lib/data/statsService';
import { authService } from '$services/auth-service';
import { auth } from '$lib/server/lucia';

import { sequence } from '@sveltejs/kit/hooks';

const setAuth = async ({ event, resolve }) => {
	event.locals.auth = auth;
	return resolve(event);
};

/** @type {import('@sveltejs/kit').Handle} */
export const handle = sequence(setAuth, async ({ event, resolve }) => {
	const sessionId = event.cookies.get('auth_session');

	

	if (sessionId) {
		try {
			const session = await authService.validateSession(sessionId);

			if (session && session.user) {
				// Create a plain JavaScript object from the user session
				const { id, username, email } = session.user;
				event.locals.user = { id, username, email };
			} else {
				// Session is invalid, clear the cookie
				event.cookies.delete('auth_session', { path: '/' });
			}
		} catch (error) {
			console.error('Session validation error:', error);
			// Clear invalid session cookie
			event.cookies.delete('auth_session', { path: '/' });
		}
	}

	const response = await resolve(event);

	if (!event.request.headers.get('x-sveltekit-prerender')) {
		const clientIP = event.request.headers.get('x-forwarded-for') || event.getClientAddress();

		let country = 'unknown';
		try {
			const geoResponse = await fetch(`https://get.geojs.io/v1/ip/geo/${clientIP}.json`);
			if (geoResponse.ok) {
				const geoData = await geoResponse.json();
				country = geoData.country || 'unknown';
			}
		} catch (err) {
			console.error('Error fetching country data:', err);
		}

		const newVisit = {
			ip: clientIP,
			country,
			timestamp: new Date()
		};

		try {
			await updateStats(newVisit);
		} catch (error) {
			console.error('Error updating visit stats:', error);
		}
	}

	return response;
});
