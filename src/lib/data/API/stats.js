import statsService from '../../services/statsService.js';

export async function get() {
  const { visitsToday, totalVisits, totalVisitors, totalCountries } = await statsService.getStats();

  return {
    body: {
      visitsToday,
      totalVisits,
      totalVisitors,
      totalCountries
    }
  };
}