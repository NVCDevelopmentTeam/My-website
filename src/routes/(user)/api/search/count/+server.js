import { json } from '@sveltejs/kit';

// Enable pre-rendering for this route to optimize performance
export const prerender = true;

/**
 * GET handler to provide the total count of search results.
 * This API is part of the search feature and returns the total number of posts
 * that can be searched. It is used for pagination and result statistics.
 */
export const GET = async () => {
	try {
		// Dynamically import all markdown files in the posts directory
		// This represents the collection of posts available for search
		const posts = import.meta.glob('$lib/posts/**/*.md');

		// Return a JSON response with the total number of posts (search results)
		return json({
			totalResults: Object.keys(posts).length // Count of all available posts
		});
	} catch {
		// Handle any errors that occur during the import
		return json(
			{
				error: 'Failed to fetch the total number of posts'
			},
			{
				status: 500
			}
		);
	}
};
