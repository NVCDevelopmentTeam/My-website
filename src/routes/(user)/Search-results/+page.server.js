export async function load({ fetch, url }) {
	const query = url.searchParams.get('q') || '';

	if (!query) {
		return { results: [], error: 'No search query provided' };
	}

	try {
		const res = await fetch(`/api/search.json?q=${encodeURIComponent(query)}`);

		if (!res.ok) {
			throw new Error('Failed to fetch search results');
		}
		const totalRes = await fetch(`${url.origin}/api/search/count`);
		const total = await totalRes.json();

		const data = await res.json();
		return { results: data.results };
	} catch (error) {
		console.error(error);
		return { results: [], error: error.message };
	}
}
