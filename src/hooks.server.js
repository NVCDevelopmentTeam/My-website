import { updateStats } from '$lib/data/statsService';
import { authService } from '$services/auth-service';
import { auth } from '$lib/server/lucia';

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('auth_session');

	event.locals.auth = auth; // Set auth object in locals

	if (sessionId) {
		try {
			const session = await authService.validateSession(sessionId);

			if (session) {
				event.locals.session = session;
				event.locals.user = session.user;
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
};
