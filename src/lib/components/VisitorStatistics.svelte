<script>
	import { onMount, onDestroy } from 'svelte';
	import { io } from 'socket.io-client';

	let visitsToday = $state(0);
	let totalVisits = $state(0);
	let totalVisitors = $state(0);
	let totalCountries = $state(0);
	let loading = $state(true);
	let error = $state(null);
	let socket;

	function initializeSocket() {
		socket = io();

		socket.on('stats-update', (data) => {
			visitsToday = data.visitsToday;
			totalVisits = data.totalVisits;
			totalVisitors = data.totalVisitors;
			totalCountries = data.totalCountries;
			loading = false;
		});

		socket.on('connect_error', (err) => {
			error = 'Không thể kết nối đến server';
			console.error('Lỗi kết nối socket:', err);
			loading = false;
		});

		socket.on('disconnect', () => {
			error = 'Mất kết nối với server';
			loading = false;
		});
	}

	async function loadStats() {
		try {
			const response = await fetch('/api/stats.json');
			if (!response.ok) {
				throw new Error('Không thể tải thống kê');
			}
			const data = await response.json();
			visitsToday = data.visitsToday;
			totalVisits = data.totalVisits;
			totalVisitors = data.totalVisitors;
			totalCountries = data.totalCountries;
			loading = false;
		} catch (err) {
			error = err.message;
			console.error('Lỗi khi tải thống kê:', err);
			loading = false;
		}
	}

	onMount(() => {
		loadStats();
		initializeSocket();
	});

	onDestroy(() => {
		if (socket) {
			socket.disconnect();
		}
	});
</script>

<h2>Thống kê khách truy cập</h2>

{#if loading}
	<p>Đang tải thống kê...</p>
{:else if error}
	<p>Lỗi: {error}</p>
{:else}
	<ul>
		<li>Lượt truy cập hôm nay: {visitsToday}</li>
		<li>Tổng lượt truy cập: {totalVisits}</li>
		<li>Tổng số khách truy cập: {totalVisitors}</li>
		<li>Tổng số quốc gia: {totalCountries}</li>
	</ul>
{/if}
