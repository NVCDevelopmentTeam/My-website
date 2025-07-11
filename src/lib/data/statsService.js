import { logVisit, getVisitStats } from '$lib/data/database';

// Function to get statistics from database
async function getStats() {
	try {
		const stats = await getVisitStats(); // Sử dụng hàm getVisitStats từ database.js
		return {
			visitsToday: stats.visitsToday,
			totalVisits: stats.totalVisits,
			totalVisitors: stats.totalVisitors,
			totalCountries: stats.totalCountries
		};
	} catch (error) {
		console.error('Error fetching statistics:', error);
		throw new Error('An error occurred while fetching the statistics.');
	}
}

// Function to update statistics in the database
async function updateStats(newVisit) {
	try {
		const { ip, country } = newVisit;
		await logVisit(ip, country); // Use logvisit functions from database.js to record visits
	} catch (error) {
		console.error('Error updating statistics:', error);
		throw new Error('An error occurred while updating the statistics.');
	}
}

export { getStats, updateStats };
