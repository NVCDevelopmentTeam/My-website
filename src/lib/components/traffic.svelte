<script context="module">
  export async function load({ fetch }) {
    const res = await fetch('/api/stats.json');
    if (!res.ok) {
      // Handle error
      console.error('Failed to load statistics:', res.statusText);
      return {
        props: {
          visitsToday: 0,
          totalVisits: 0,
          totalVisitors: 0,
          totalCountries: 0
        }
      };
    }
    const data = await res.json();
    console.log('Data from API:', data);
    return {
      props: data
    };
  }
  export let visitsToday;
  export let totalVisits;
  export let totalVisitors;
  export let totalCountries;

  $: console.log('Statistics:', { visitsToday, totalVisits, totalVisitors, totalCountries });
</script>

<h2>Visitor statistics</h2>
<ul>
  <li>Visits Today: {visitsToday}</li>
  <li>Total Visits: {totalVisits}</li>
  <li>Total Visitors: {totalVisitors}</li>
  <li>Total Countries: {totalCountries}</li>
</ul>
