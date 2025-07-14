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

<div class="bg-card p-6 rounded-lg shadow-md">
	<h2 class="text-xl font-bold mb-4">Thống kê khách truy cập</h2>

	{#if loading}
		<p class="text-muted-foreground">Đang tải thống kê...</p>
	{:else if error}
		<p class="text-destructive">Lỗi: {error}</p>
	{:else}
		<ul class="space-y-2">
			<li class="text-foreground">Lượt truy cập hôm nay: {visitsToday}</li>
			<li class="text-foreground">Tổng lượt truy cập: {totalVisits}</li>
			<li class="text-foreground">Tổng số khách truy cập: {totalVisitors}</li>
			<li class="text-foreground">Tổng số quốc gia: {totalCountries}</li>
		</ul>
	{/if}
</div>
