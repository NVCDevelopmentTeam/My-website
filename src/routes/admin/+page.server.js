export const load = async ({ url, fetch }) => {
	try {
		const postRes = await fetch(`${url.origin}/api/posts.json`);
		const posts = await postRes.json();

		const totalRes = await fetch(`${url.origin}/api/posts/count`);
		const total = await totalRes.json();

		return { posts, total };
	} catch (error) {
		console.error('Error loading posts:', error);
		return {
			posts: [],
			total: 0
		};
	}
};

export const actions = {
	create: async ({ request, url }) => {
		try {
			const formData = await request.formData();
			const title = formData.get('title');
			const summary = formData.get('summary');
			const postUrl = formData.get('url');

			const response = await fetch(`${url.origin}/api/new-post`, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ title, summary, url: postUrl })
			});

			if (!response.ok) {
				throw new Error('Failed to create post');
			}

			return { success: true };
		} catch (error) {
			console.error('Error creating post:', error);
			return { success: false, error: error.message };
		}
	}
};
