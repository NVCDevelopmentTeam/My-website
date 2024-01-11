import database from '$lib/data/database';
import analyticsService from '$lib/data/analyticsService';

// Create an instance of the Database class
const databaseInstance = new Database();

// Create an instance of the AnalyticsService class
const analytics = new AnalyticsService(databaseInstance);

export async function getStats() {
  try {
    return await analytics.getStats();
  } catch (error) {
    console.error('Error occurred while fetching stats:', error);
    throw error;
  }
}
