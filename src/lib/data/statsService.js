import database from '$lib/data/database';
import AnalyticsService from '$lib/data/analyticsService';

// Create an instance of the Database class
const databaseInstance = database;

// Create an instance of the AnalyticsService class
const analytics = new AnalyticsService(databaseInstance);

// Define an async function to get the stats
export async function getStats() {
  // Use a try-catch block to handle errors
  try {
    // Await the results of the async functions
    const [visitsToday, totalVisits, totalVisitors, totalCountries] = await Promise.all([
      analytics.getVisitsToday(),
      databaseInstance.getTotalVisits(),
      databaseInstance.getTotalVisitors(),
      databaseInstance.getTotalCountries()
    ]);

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
