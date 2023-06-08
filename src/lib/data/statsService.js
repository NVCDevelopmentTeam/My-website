import database from './database.js';
import analyticsService from './analyticsService.js';

async function getStats() {
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
}

export default {
  getStats
};