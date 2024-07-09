import { getStats, updateStatsOnVisit } from '$lib/data/statsService';

export async function GET() {
  try {
    // Update stats on each visit
    await updateStatsOnVisit();

    // Get updated stats
    const { visitsToday, totalVisits, totalVisitors, totalCountries } = await getStats();

    return {
      status: 200,
      body: {
        visitsToday: parseInt(visitsToday, 10),
        totalVisits: parseInt(totalVisits, 10),
        totalVisitors: parseInt(totalVisitors, 10),
        totalCountries: parseInt(totalCountries, 10)
      }
    };
  } catch (error) {
    console.error('Stats API error:', error);

    return {
      status: 500,
      body: {
        error: 'An error occurred while fetching or updating the statistics.'
      }
    };
  }
}
