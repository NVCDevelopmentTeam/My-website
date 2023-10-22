import database from '$lib/data/database';
import analytics from '$lib/data/analytics';

export async function getStats() {
  try {
    const visitsToday = await analyticsService.getVisitsToday();
    const totalVisits = await database.getTotalVisits();
    const totalVisitors = await database.getTotalVisitors();
    const totalCountries = await database.getTotalCountries();

    return {
      visitsToday,
      totalVisits,
      totalVisitors,
      totalCountries
    };
  } catch (error) {
    console.error('Error occurred while fetching stats:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}