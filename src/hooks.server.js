import { getStats, updateStats } from '$lib/data/statsService';

export const handle = async ({ event, resolve }) => {
  // Start request event
  const response = await resolve(event);

  // Get the client's IP address
  const clientIP = event.request.headers.get('x-forwarded-for') || event.getClientAddress() || 'unknown';

  // Retrieve country information based on IP (this requires an external API or service)
  let country = 'unknown';
  try {
    // Example: Call an external geolocation API to get the country
    const geoResponse = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=YOUR_API_KEY&ip=${clientIP}`);
    const geoData = await geoResponse.json();
    country = geoData.country_name || 'unknown';
  } catch (err) {
    console.error('Error fetching country data:', err);
  }

  // Create a new visit record
  const newVisit = {
    ip: clientIP,
    country, // Add the country information
    timestamp: new Date()
  };

  try {
    // Update visit statistics
    await updateStats(newVisit);
  } catch (error) {
    console.error('Error updating visit stats:', error);
  }

  // Return response
  return response;
};
