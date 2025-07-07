import { postsPerPage } from '$lib/data/config';
import { writable, derived } from 'svelte/store';
import FlexSearch from 'flexsearch';

// Stores
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

// FlexSearch index configuration
const index = new FlexSearch.Document({
	document: {
		id: 'slug',
		index: ['title', 'content', 'author'],
		store: ['title', 'author', 'date', 'categories', 'tags', 'preview', 'readingTime', 'slug']
	}
});

let indexInitialized = false;

function addPostsToIndex(posts) {
	posts.forEach((post) => {
		index.add(post);
	});
	indexInitialized = true;
}

async function initializeIndex() {
	if (!indexInitialized) {
		try {
			const response = await fetch('/api/search.json');
			if (!response.ok) {
				throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
			}
			const data = await response.json();
			addPostsToIndex(data.results);
		} catch (error) {
			console.error('Error initializing search index:', error);
			throw error;
		}
	}
}

async function searchPosts(query, filters = {}) {
	await initializeIndex();

	const searchOptions = {
		limit: 1000, // Set a sensible limit
		suggest: true,
		...filters
	};

	try {
		const results = await index.search(query, searchOptions);
		return results.flatMap((result) => result.result);
	} catch (error) {
		console.error('Error during search:', error);
		throw error;
	}
}

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

export const combinedSearch = derived(
	[searchQuery, searchFilters],
	([$searchQuery, $searchFilters]) => {
		return { query: $searchQuery, filters: $searchFilters };
	}
);

combinedSearch.subscribe(({ query, filters }) => {
	if (query.trim()) {
		debouncedSearch(query, filters);
	} else {
		searchResults.set([]);
		totalResults.set(0);
		noResults.set(false);
	}
});

export function updateSearchFilters(newFilters) {
	searchFilters.update((currentFilters) => ({
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

export function search(query, filters = {}) {
	searchQuery.set(query);
	updateSearchFilters(filters);
}
