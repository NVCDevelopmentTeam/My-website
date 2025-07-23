import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	try {
		const post = await import(`../../../../lib/posts/${params.post}.md`);
		const { metadata } = post;

		// Explicitly pick only the properties we need and ensure they are serializable.
		const meta = {
			slug: params.post,
			title: metadata.title,
			preview: metadata.preview,
			date: metadata.date ? new Date(metadata.date).toISOString() : null,
			updated: metadata.updated ? new Date(metadata.updated).toISOString() : null,
			author: metadata.author,
			categories: metadata.categories,
			coverImage: metadata.coverImage,
			coverWidth: metadata.coverWidth,
			coverHeight: metadata.coverHeight,
			tags: metadata.tags
		};

		return {
			meta
		};
	} catch (e) {
		// Pass a serializable error message instead of the whole error object.
		error(404, { message: `Could not load post: ${params.post}` });
	}
};
