import { getStats } from '$lib/data/statsService';

export async function get() {
  try {
    const { visitsToday, totalVisits, totalVisitors, totalCountries } = await getStats();

    // Assuming the values need to be parsed to integers, otherwise remove this step
    return {
      body: {
        visitsToday: parseInt(visitsToday, 10), // example of transforming the data
        totalVisits: parseInt(totalVisits, 10),
        totalVisitors: parseInt(totalVisitors, 10),
        totalCountries: parseInt(totalCountries, 10),
      }
    };
  } catch (error) {
    console.error('Stats API error:', error);

    // Send back a generic error message and a 500 status code
    return {
      status: 500,
      body: {
        error: 'An error occurred while fetching the statistics.',
      }
    };
  }
}
