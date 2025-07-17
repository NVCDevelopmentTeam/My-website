import { postsPerPage } from '$lib/data/config';
import { fetchPosts } from '$lib/data/fetchPosts';
import { json } from '@sveltejs/kit';

export const prerender = true;

export const GET = async () => {
	const options = {
		limit: postsPerPage
	};

	const { posts, total } = await fetchPosts(options);
	return json({ posts, total });
};
