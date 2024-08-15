import { writable } from 'svelte/store';

export const searchQuery = writable('');
export const searchResults = writable([]);
export const isLoading = writable(false);
export const noResults = writable(false);
export const totalResults = writable(0);

export const searchFilters = writable({
  category: '',
  tag: '',
  author: ''
});

export async function search(query, filters = {}) {
  searchQuery.set(query);
  isLoading.set(true);
  noResults.set(false);

  try {
    const urlParams = new URLSearchParams({
      q: query,
      ...filters
    });

    const response = await fetch(`/api/search.json?${urlParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }

    const data = await response.json();
    
    searchResults.set(data.results);
    totalResults.set(data.count);
    noResults.set(data.count === 0);
  } catch (error) {
    console.error('Error during search:', error);
    searchResults.set([]);
    totalResults.set(0);
    noResults.set(true);
  } finally {
    isLoading.set(false);
  }
}

export function updateSearchFilters(newFilters) {
  searchFilters.update(currentFilters => ({
    ...currentFilters,
    ...newFilters
  }));
}

export function clearSearchFilters() {
  searchFilters.set({
    category: '',
    tag: '',
    author: ''
  });
}

export function subscribeToSearchChanges(callback) {
  return searchQuery.subscribe(query => {
    searchFilters.subscribe(filters => {
      if (query) {
        search(query, filters);
      } else {
        searchResults.set([]);
        totalResults.set(0);
        noResults.set(false);
      }
    });
  });
}