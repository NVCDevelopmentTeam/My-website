import { postsPerPage } from '$lib/data/config';
import { parse } from 'node-html-parser';
import readingTime from 'reading-time';

const generateSlug = (filepath) => {
	return filepath
		.replace(/^\/src\/lib\/posts\//, '')
		.replace(/\/index\.md$/, '')
		.replace(/\.md$/, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
};

const formatDate = (date) => {
	const d = new Date(date);
	if (isNaN(d.getTime())) return undefined;
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

const addTimezoneOffset = (date) => {
	const offsetInMilliseconds = new Date().getTimezoneOffset() * 60 * 1000;
	return new Date(date.getTime() + offsetInMilliseconds);
};

export const fetchPosts = async ({ offset = 0, limit = postsPerPage, category = '' } = {}) => {
	try {
		const postFiles = import.meta.glob('/src/lib/posts/**/*.md', { eager: true });

		if (Object.keys(postFiles).length === 0) {
			console.error('No post files found');
			return { posts: [], total: 0 };
		}

		const posts = await Promise.all(
			Object.entries(postFiles).map(async ([filepath, post]) => {
				if (!post.metadata || !post.default) {
					console.error(`Invalid post rendering for ${filepath}`);
					return null;
				}

				const html = parse(post.default);
				const previewElement = post.metadata.preview
					? parse(post.metadata.preview)
					: html.querySelector('p');
				const previewText = previewElement ? previewElement.toString() : '';
				const structuredText = html.structuredText || '';

				const slug = generateSlug(filepath);

				return {
					...post.metadata,
					slug,
					content: structuredText,
					preview: {
						html: previewText,
						text: previewElement ? previewElement.structuredText || previewText : previewText
					},
					readingTime: readingTime(structuredText).text,
					date: post.metadata.date
						? formatDate(addTimezoneOffset(new Date(post.metadata.date)))
						: undefined
				};
			})
		);

		const validPosts = posts.filter((post) => post !== null);
		let sortedPosts = validPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

		if (category) {
			sortedPosts = sortedPosts.filter(
				(post) => post.categories && post.categories.includes(category)
			);
		}

		if (offset > 0) {
			sortedPosts = sortedPosts.slice(offset);
		}

		if (limit > 0 && limit < sortedPosts.length) {
			sortedPosts = sortedPosts.slice(0, limit);
		}

		const postsWithLinks = sortedPosts.map((post, index, allPosts) => ({
			...post,
			next: allPosts[index - 1] ?? null,
			previous: allPosts[index + 1] ?? null
		}));

		const filteredPosts = postsWithLinks.filter((post) => {
			const isPublished = new Date() >= new Date(post.date);
			const isHidden = !!post.hidden;
			return isPublished && !isHidden;
		});

		return {
			posts: filteredPosts,
			total: validPosts.length
		};
	} catch (error) {
		console.error('Error fetching posts:', error);
		throw new Error('Error fetching posts');
	}
};

export default fetchPosts;
