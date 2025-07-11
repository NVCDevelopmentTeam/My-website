import { postsPerPage } from '$lib/data/config';
import fetchPosts from '$lib/data/fetchPosts';
import { json } from '@sveltejs/kit';

// Enable pre-rendering for this route to optimize performance
// Note: Uncomment if you want to enable prerendering
// export const prerender = true;

export const GET = async ({ params }) => {
	try {
		// Parse the page parameter and set default value to 1 if not provided
		const page = parseInt(params.page) || 1;

		// Calculate offset based on the page number
		const options = {
			offset: (page - 1) * postsPerPage,
			limit: postsPerPage
		};

		// Fetch posts based on the calculated options
		const { posts } = await fetchPosts(options);

		// Return the fetched posts as JSON
		return json({
			page,
			posts
		});
	} catch {
		// Handle any errors that occur during the fetch
		return json(
			{
				error: 'Failed to fetch posts'
			},
			{
				status: 500
			}
		);
	}
};
