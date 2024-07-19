import database from '$lib/data/database';

// Function to get statistics from database
async function getStats() {
  try {
    const { visitsToday, totalVisits, totalVisitors, totalCountries } = database.getStats();
    return {
      visitsToday,
      totalVisits,
      totalVisitors,
      totalCountries
    };
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw new Error('An error occurred while fetching the statistics.');
  }
}

// Function to update statistics in the database
async function updateStats(newVisit) {
  try {
    database.updateStats(newVisit);
  } catch (error) {
    console.error('Error updating statistics:', error);
    throw new Error('An error occurred while updating the statistics.');
  }
}

export { getStats, updateStats };