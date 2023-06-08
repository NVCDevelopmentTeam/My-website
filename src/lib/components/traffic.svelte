<script context="module">
  export async function load({ fetch }) {
    const res = await fetch('/api/stats');
    const { visitsToday, totalVisits, totalVisitors, totalCountries } = await res.json();

    return {
      props: {
        visitsToday,
        totalVisits,
        totalVisitors,
        totalCountries
      }
    };
  }
  export let visitsToday;
  export let totalVisits;
  export let totalVisitors;
  export let totalCountries;
</script>

<ul>
  <li>Visits Today: {visitsToday}</li>
  <li>Total Visits: {totalVisits}</li>
  <li>Total Visitors: {totalVisitors}</li>
  <li>Total Countries: {totalCountries}</li>
</ul>