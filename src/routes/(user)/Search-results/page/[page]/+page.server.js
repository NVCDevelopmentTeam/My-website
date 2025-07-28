import { postsPerPage } from '$lib/data/config';
import { fetchPosts } from '$lib/data/fetchPosts';
import { redirect } from '@sveltejs/kit';

export const load = async ({ url, params, fetch }) => {
	const page = parseInt(params.page) || 1;

	// Prevent duplicating the blog index route as page 1
	if (page <= 1) {
		redirect(301, '/Search-results');
	}

	let offset = page * postsPerPage - postsPerPage;

	// Fetch the total number of posts
	const totalPostsRes = await fetch(`${url.origin}/api/search/count`);
	if (!totalPostsRes.ok) {
		return { status: totalPostsRes.status, error: new Error('Failed to fetch total posts count') };
	}
	const total = await totalPostsRes.json();

	// Fetch the posts for the current page
	const { posts } = await fetchPosts({ offset, limit: postsPerPage });

	return {
		posts,
		page,
		totalPosts: total
	};
};
