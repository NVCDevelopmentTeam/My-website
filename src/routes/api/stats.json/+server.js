import Statsservice from '$lib/data/Statsservice';

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