// Import modules from the lib folder
import Database from '$lib/data/Database';
import AnalyticsService from '$lib/data/AnalyticsService';

// Define an async function to get the stats
export async function getStats() {
  // Use a try-catch block to handle errors
  try {
    // Await the results of the async functions
    const visitsToday = await analytics.getVisitsToday();
    const totalVisits = await database.getTotalVisits();
    const totalVisitors = await database.getTotalVisitors();
    const totalCountries = await database.getTotalCountries();

    // Return an object with the stats
    return {
      visitsToday,
      totalVisits,
      totalVisitors,
      totalCountries
    };
  } catch (error) {
    // Log the error and rethrow it
    console.error('Error occurred while fetching stats:', error);
    throw error;
  }
}
