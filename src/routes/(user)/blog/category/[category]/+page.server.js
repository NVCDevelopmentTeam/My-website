import { fetchPosts } from '$lib/data/fetchPosts';

export const load = async ({ params }) => {
	const category = params.category;
	const { posts, total } = await fetchPosts({ category, limit: -1 });

	return {
		posts,
		category,
		total
	};
};
