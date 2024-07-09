import { searchQuery, searchResults } from '$lib/data/searchStore';

export async function search(query) {
  try {
    const response = await fetch(`/api/search?q=${query}`);
    const results = await response.json();
    searchResults.set(results);
    return results;
  } catch (error) {
    console.error(error);
    return [];
  }
}
