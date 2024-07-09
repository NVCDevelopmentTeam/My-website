import database from '$lib/data/database';

export async function getStats() {
  try {
    const stats = database.getStats();
    return stats || { visitsToday: 0, totalVisits: 0, totalVisitors: 0, totalCountries: 0 };
  } catch (error) {
    console.error('Error occurred while fetching stats:', error);
    throw error;
  }
}

export async function updateStatsOnVisit() {
  try {
    const currentStats = await getStats();
    const updatedStats = {
      visitsToday: currentStats.visitsToday + 1,
      totalVisits: currentStats.totalVisits + 1,
      totalVisitors: currentStats.totalVisitors + 1,
      totalCountries: currentStats.totalCountries, // assume countries count remains unchanged on each visit
    };
    await database.updateStats(updatedStats);
  } catch (error) {
    console.error('Error occurred while updating stats on visit:', error);
    throw error;
  }
}
