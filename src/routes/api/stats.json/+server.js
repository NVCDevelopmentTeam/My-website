import statsService from '$lib/data/statsService';

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