<script>
  import { onMount } from 'svelte';

  let visitsToday = 0;
  let totalVisits = 0;
  let totalVisitors = 0;
  let totalCountries = 0;

  async function loadStats() {
    try {
      const response = await fetch('/api/stats.json');
      if (!response.ok) {
        throw new Error('Failed to load statistics');
      }
      const data = await response.json();
      visitsToday = data.visitsToday;
      totalVisits = data.totalVisits;
      totalVisitors = data.totalVisitors;
      totalCountries = data.totalCountries;
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  }

  onMount(() => {
    loadStats();
  });
</script>

<h2>Visitor Statistics</h2>
<ul>
  <li>Visits Today: {visitsToday}</li>
  <li>Total Visits: {totalVisits}</li>
  <li>Total Visitors: {totalVisitors}</li>
  <li>Total Countries: {totalCountries}</li>
</ul>
