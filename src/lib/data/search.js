import { writable, derived } from 'svelte/store';
import FlexSearch from 'flexsearch';

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

// Initialize FlexSearch index
const index = new FlexSearch.Document({
  document: {
    id: 'slug',
    index: ['title', 'content', 'author'],
    store: ['title', 'author', 'date', 'categories', 'tags', 'preview', 'readingTime', 'slug'],
  },
});

let indexInitialized = false;

// Function to add posts to FlexSearch index
function addPostsToIndex(posts) {
  posts.forEach(post => {
    index.add(post);
  });
  indexInitialized = true;
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Async function to fetch posts and initialize index
async function initializeIndex() {
  if (!indexInitialized) {
    try {
      const response = await fetch('/api/search.json');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      addPostsToIndex(data.results);
    } catch (error) {
      console.error('Error initializing search index:', error);
    }
  }
}

// Search function using FlexSearch
async function searchPosts(query, filters = {}) {
  await initializeIndex();
  
  const searchOptions = {
    limit: 1000,
    suggest: true,
    ...filters
  };
  
  const results = await index.searchAsync(query, searchOptions);
  return results.flatMap(result => result.result);
}

// Debounced search function
const debouncedSearch = debounce(async (query, filters) => {
  isLoading.set(true);
  noResults.set(false);
  
  try {
    const results = await searchPosts(query, filters);
    searchResults.set(results);
    totalResults.set(results.length);
    noResults.set(results.length === 0);
  } catch (error) {
    console.error('Error during search:', error);
    searchResults.set([]);
    totalResults.set(0);
    noResults.set(true);
  } finally {
    isLoading.set(false);
  }
}, 300);

// Derived store for combined search query and filters
export const combinedSearch = derived(
  [searchQuery, searchFilters],
  ([$searchQuery, $searchFilters]) => {
    return { query: $searchQuery, filters: $searchFilters };
  }
);

// Subscribe to changes in combinedSearch
combinedSearch.subscribe(({ query, filters }) => {
  if (query) {
    debouncedSearch(query, filters);
  } else {
    searchResults.set([]);
    totalResults.set(0);
    noResults.set(false);
  }
});

export function updateSearchFilters(newFilters) {
  searchFilters.update(currentFilters => ({
    ...currentFilters,
    ...newFilters,
  }));
}

export function clearSearchFilters() {
  searchFilters.set({
    category: '',
    tag: '',
    author: '',
  });
}

// Export search function for backwards compatibility
export function search(query, filters = {}) {
  searchQuery.set(query);
  updateSearchFilters(filters);
}