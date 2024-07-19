import { getStats, updateStats } from '$lib/data/statsService';

export const handle = async ({ event, resolve }) => {
  // Start request event
  const response = await resolve(event);

  // Get the client's IP address
  const clientIP = event.request.headers.get('x-forwarded-for') || event.getClientAddress() || 'unknown';

  // Create a new visit record
  const newVisit = {
    ip: clientIP,
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