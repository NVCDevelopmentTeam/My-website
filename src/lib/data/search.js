import { writable } from 'svelte/store';

// Store for search query
export const searchQuery = writable('');

// Store for search results
export const searchResults = writable([]);

/**
 * Performs a search based on the provided query.
 * @param {string} query - The search query.
 * @returns {Promise<Array>} - An array of search results.
 */
export async function search(query) {
  try {
    // Encode the search query
    const ResApi = `/api/search.json?q=${encodeURIComponent(query)}`;
    
    // Fetch the search results from the API
    const response = await fetch(ResApi);
    
    // Check if the response is ok
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Parse the JSON response
    const results = await response.json();
    
    // Update the search results store
    searchResults.set(results);
    
    return results;
  } catch (error) {
    console.error('Error during search:', error);
    
    // Clear previous results in case of error
    searchResults.set([]);
    
    return [];
  }
}
