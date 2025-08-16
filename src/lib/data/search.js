import { writable, derived } from 'svelte/store';
import FlexSearch from 'flexsearch';

// --- Stores ---
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

// --- FlexSearch Index ---

/**
 * @type {import('flexsearch').Document<any, any>}
 */
const index = new FlexSearch.Document({
	document: {
		id: 'slug',
		index: ['title', 'content', 'author'],
		store: ['title', 'author', 'date', 'categories', 'tags', 'preview', 'readingTime', 'slug']
	},
	tokenize: 'forward'
});

/**
 * Populates the search index with an array of posts.
 * This should be called once when the application loads.
 * @param {Array<Object>} posts - The posts to add to the index.
 */
export function populateIndex(posts) {
	posts.forEach((post) => {
		index.add(post);
	});
}

/**
 * Performs a search on the index.
 * @param {string} query - The search query.
 * @param {object} filters - The filters to apply.
 * @returns {Promise<Array<Object>>} - The search results.
 */
async function searchPosts(query, filters = {}) {
	const searchOptions = {
		limit: 100,
		suggest: true,
		// FlexSearch document search uses a `where` clause for filtering
		where: (item) => {
			let isMatch = true;
			if (filters.category && !item.categories?.includes(filters.category)) {
				isMatch = false;
			}
			if (filters.tag && !item.tags?.includes(filters.tag)) {
				isMatch = false;
			}
			if (filters.author && item.author !== filters.author) {
				isMatch = false;
			}
			return isMatch;
		}
	};

	const results = await index.search(query, searchOptions);
	// Flatten results from different fields
	return results.flatMap((result) => result.result);
}

// --- Debounced Search Logic ---

function debounce(func, wait) {
	let timeout;
	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), wait);
	};
}

const debouncedSearch = debounce(async (query, filters) => {
	isLoading.set(true);
	noResults.set(false);

	try {
		const results = await searchPosts(query, filters);
		searchResults.set(results);
		totalResults.set(results.length);
		noResults.set(results.length === 0 && query.length > 0);
	} catch (error) {
		console.error('Search error:', error);
		searchResults.set([]);
		totalResults.set(0);
		noResults.set(true);
	} finally {
		isLoading.set(false);
	}
}, 300);

// --- Derived Store for Automatic Searching ---

export const combinedSearch = derived(
	[searchQuery, searchFilters],
	([$searchQuery, $searchFilters]) => {
		return { query: $searchQuery, filters: $searchFilters };
	}
);

// Subscribe to changes in query or filters to trigger a search
combinedSearch.subscribe(({ query, filters }) => {
	if (query.trim()) {
		debouncedSearch(query, filters);
	} else {
		searchResults.set([]);
		totalResults.set(0);
		noResults.set(false);
	}
});

// --- Public API ---

/**
 * Updates the search filters.
 * @param {Partial<typeof searchFilters>} newFilters - The new filter values.
 */
export function updateSearchFilters(newFilters) {
	searchFilters.update((currentFilters) => ({
		...currentFilters,
		...newFilters
	}));
}

/**
 * Clears all active search filters.
 */
export function clearSearchFilters() {
	searchFilters.set({
		category: '',
		tag: '',
		author: ''
	});
}

/**
 * A convenience function to manually trigger a search.
 * @param {string} query - The search query.
 * @param {object} [filters] - Optional filters.
 */
export function search(query, filters = {}) {
	searchQuery.set(query);
	if (Object.keys(filters).length > 0) {
		updateSearchFilters(filters);
	}
}
