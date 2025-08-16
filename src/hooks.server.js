import { browser } from '$app/environment';
import { updateStats } from '$lib/data/statsService';
import { auth } from '$lib/server/lucia';

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
	const { user, session } = await auth.handleRequest(event);
	event.locals.user = user;
	event.locals.session = session;

	const response = await resolve(event);

	if (browser && !event.request.headers.get('x-sveltekit-prerender')) {
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
