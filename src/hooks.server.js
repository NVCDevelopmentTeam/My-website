import { updateStats } from '$lib/data/statsService';
import { auth } from '$lib/server/lucia';

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
  // Initialize authentication for the current request
  event.locals.auth = auth.handleRequest(event);

  // Proceed to resolve the request and obtain the response
  const response = await resolve(event);

  // Determine the client's IP address
  const clientIP =
    event.request.headers.get('x-forwarded-for') || event.getClientAddress();

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

  // Return the response to the client
  return response;
};
