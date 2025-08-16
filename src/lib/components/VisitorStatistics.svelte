<script>
	import { onMount, onDestroy } from 'svelte';
	import io from 'socket.io-client'; // Import socket.io-client

	let visitsToday = $state(0);
	let totalVisits = $state(0);
	let totalVisitors = $state(0);
	let totalCountries = $state(0);
	let loading = $state(true);
	let error = $state(null);
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

<h2 class="text-2xl font-bold mb-4 text-gray-800">Visitor Statistics</h2>

{#if loading}
	<p class="text-gray-600 italic">Loading statistics...</p>
{:else if error}
	<p class="text-red-500">{error}</p>
{:else}
	<ul class="space-y-3">
		<li class="flex items-center bg-white p-3 rounded-lg shadow-sm">
			<span class="font-semibold text-gray-700 mr-2">Visits Today:</span>
			<span class="text-blue-600">{visitsToday}</span>
		</li>
		<li class="flex items-center bg-white p-3 rounded-lg shadow-sm">
			<span class="font-semibold text-gray-700 mr-2">Total Visits:</span>
			<span class="text-blue-600">{totalVisits}</span>
		</li>
		<li class="flex items-center bg-white p-3 rounded-lg shadow-sm">
			<span class="font-semibold text-gray-700 mr-2">Total Visitors:</span>
			<span class="text-blue-600">{totalVisitors}</span>
		</li>
		<li class="flex items-center bg-white p-3 rounded-lg shadow-sm">
			<span class="font-semibold text-gray-700 mr-2">Total Countries:</span>
			<span class="text-blue-600">{totalCountries}</span>
		</li>
	</ul>
{/if}
