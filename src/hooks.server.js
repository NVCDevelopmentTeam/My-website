import { updateStats } from '$lib/data/statsService';

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
	// Initialize simple auth for the current request
	event.locals.auth = {
		validate: async () => null, // Simplified - no session validation for now
		setSession: (session) => {
			// Simplified session setting
			event.locals.session = session;
		}
	};

	// Proceed to resolve the request and obtain the response
	const response = await resolve(event);

	// Only run this logic if not prerendering
	if (!event.request.headers.get('x-sveltekit-prerender')) {
		// Determine the client's IP address
		const clientIP = event.request.headers.get('x-forwarded-for') || event.getClientAddress();

		// Initialize country as 'unknown' by default
		let country = 'unknown';
		try {
			// Fetch geolocation data based on the client's IP address
			const geoResponse = await fetch(`https://get.geojs.io/v1/ip/geo/${clientIP}.json`);
			if (geoResponse.ok) {
				const geoData = await geoResponse.json();
				country = geoData.country || 'unknown';
			}
		} catch (err) {
			// Log any errors encountered during the geolocation fetch
			console.error('Error fetching country data:', err);
		}

		// Construct a new visit record with IP, country, and timestamp
		const newVisit = {
			ip: clientIP,
			country,
			timestamp: new Date()
		};

		try {
			// Update the visit statistics with the new record
			await updateStats(newVisit);
		} catch (error) {
			// Log any errors encountered while updating statistics
			console.error('Error updating visit stats:', error);
		}
	}

	// Return the response to the client
	return response;
};
