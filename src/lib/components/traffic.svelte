<script>
  import { onMount } from 'svelte';

  let visitsToday = 0;
  let totalVisits = 0;
  let totalVisitors = 0;
  let totalCountries = 0;
  let loading = true;
  let error = null;

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
      loading = false;
    } catch (err) {
      error = err.message;
      console.error('Error loading statistics:', err);
      loading = false;
    }
  }

  onMount(() => {
    loadStats();
  });
</script>

<h2>Visitor Statistics</h2>

{#if loading}
  <p>Loading statistics...</p>
{:else if error}
  <p>Error: {error}</p>
{:else}
  <ul>
    <li>Visits Today: {visitsToday}</li>
    <li>Total Visits: {totalVisits}</li>
    <li>Total Visitors: {totalVisitors}</li>
    <li>Total Countries: {totalCountries}</li>
  </ul>
{/if}

<style>
  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    margin-bottom: 10px;
    font-size: 1.2rem;
  }

  p {
    font-size: 1.2rem;
    color: #ff0000; /* Error color */
  }
</style>
