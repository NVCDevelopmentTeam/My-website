import { getStats, incrementVisitorCount } from '$lib/data/statsService';

export async function GET() {
  try {
    await incrementVisitorCount();
    const stats = await getStats();

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return new Response(JSON.stringify({
      error: 'An error occurred while fetching or updating the statistics.'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
