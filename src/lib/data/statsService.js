import database from '$lib/data/database';
import analyticsService from '$lib/data/analyticsService';

// Create an instance of the Database class
const databaseInstance = new database();

// Create an instance of the analyticsService class
const analytics = new analyticsService(databaseInstance);

export async function getStats() {
  try {
    return await analytics.getStats();
  } catch (error) {
    console.error('Error occurred while fetching stats:', error);
    throw error;
  }
}