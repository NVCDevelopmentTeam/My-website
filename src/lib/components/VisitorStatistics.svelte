<script>
  import { onMount, onDestroy } from 'svelte';
  import io from 'socket.io-client'; // Import socket.io-client

  let visitsToday = 0;
  let totalVisits = 0;
  let totalVisitors = 0;
  let totalCountries = 0;
  let loading = true;
  let error = null;
  let socket;

  // Function to initialize socket connection
  function initializeSocket() {
    // Connect to the socket.io server
    socket = io();

    // Listen for 'stats' event from server
    socket.on('stats', (data) => {
      visitsToday = data.visitsToday;
      totalVisits = data.totalVisits;
      totalVisitors = data.totalVisitors;
      totalCountries = data.totalCountries;
      loading = false;
    });

    // Handle connection errors
    socket.on('connect_error', (err) => {
      error = 'Failed to connect to the server';
      console.error('Socket connection error:', err);
      loading = false;
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      error = 'Disconnected from the server';
      loading = false;
    });
  }

  // Load stats from API on mount
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
    initializeSocket();
  });

  onDestroy(() => {
    // Clean up the socket connection when the component is destroyed
    if (socket) {
      socket.disconnect();
    }
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
