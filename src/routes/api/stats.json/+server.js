import { openDB, getVisitStats } from '$lib/data/database';

export async function GET() {
  try {
    // Fetch visit statistics from the database
    const stats = await getVisitStats();

    // Return the statistics in JSON format
    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    // Log the error and return an error response
    console.error('Error fetching stats:', error);
    return new Response(JSON.stringify({ error: 'An error occurred while fetching the statistics.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
