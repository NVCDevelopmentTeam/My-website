import { fetchPosts } from '$lib/data/fetchPosts';

export const load = async ({ params }) => {
	const tag = params.tag;
	const { posts, total } = await fetchPosts({ tag, limit: -1 });

	return {
		posts,
		tag,
		total
	};
};
