// Import necessary functions from SvelteKit
import { error } from '@sveltejs/kit';

// Load function to fetch the post data based on the slug parameter
/** @type {import('@sveltejs/kit').PageLoad} */
export const load = async ({ params }) => {
	try {
		// Dynamically import the markdown file based on the post slug
		const post = await import(`../../../lib/posts/${params.post}.md`);

		return {
			// Return the content of the post and its metadata
			PostContent: post.default,
			meta: { ...post.metadata, slug: params.post }
		};
	} catch (err) {
		// If there's an error (e.g., post not found), return a 404 error
		throw error(404, `Post not found: ${err.message}`);
	}
};
