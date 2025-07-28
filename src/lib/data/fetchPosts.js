import { postsPerPage } from '$lib/data/config';
import { parse } from 'node-html-parser';
import { render } from 'svelte/server';
import readingTime from 'reading-time';

/**
 * @typedef {Object} Post
 * @property {string} slug
 * @property {string} title
 * @property {string} author
 * @property {string} date
 * @property {string[]} categories
 * @property {string[]} [tags]
 * @property {string} [updated]
 * @property {boolean} [published]
 * @property {boolean} [hidden]
 * @property {string} [preview]
 * @property {string} [content]
 * @property {Object} [readingTime]
 */

/**
 * @typedef {Object} PostModule
 * @property {Post} metadata
 * @property {any} default
 */

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

export const fetchPosts = async ({
	offset = 0,
	limit = postsPerPage,
	category = '',
	tag = '',
	author = ''
} = {}) => {
	try {
		const postFiles = import.meta.glob('/src/lib/posts/**/*.md', { eager: true });

		if (Object.keys(postFiles).length === 0) {
			console.error('No post files found');
			return { posts: [], total: 0 };
		}

		const posts = await Promise.all(
			Object.entries(postFiles).map(async ([filepath, postModule]) => {
				const post = /** @type {PostModule} */ (postModule);
				if (!post.metadata || !post.default) {
					console.error(`Invalid post rendering for ${filepath}`);
					return null;
				}

				const html = parse(render(post.default).html);
				const previewElement = post.metadata.preview
					? parse(post.metadata.preview)
					: html.querySelector('p') || null;
				const previewText = previewElement ? previewElement.toString() : '';
				const structuredText = html.structuredText || '';

				const slug = generateSlug(filepath);
				const finalSlug = slug || `untitled-post-${Math.random().toString(36).substring(2, 9)}`;

				return {
					...post.metadata,
					slug: finalSlug,
					content: structuredText,
					preview: {
						html: previewText,
						text: previewElement ? previewElement.structuredText || previewText : previewText
					},
					readingTime: readingTime(structuredText).text,
					date: post.metadata.date ? formatDate(new Date(post.metadata.date)) : undefined
				};
			})
		);

		let validPosts = posts.filter((post) => {
			if (!post || !post.date) return false;
			const isPublished = new Date() >= new Date(post.date);
			const isHidden = !!post.hidden;
			return post.slug !== undefined && isPublished && !isHidden;
		});

		let sortedPosts = validPosts.sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
		);

		if (category) {
			sortedPosts = sortedPosts.filter(
				(post) => post.categories && post.categories.includes(category)
			);
		}

		if (tag) {
			sortedPosts = sortedPosts.filter((post) => post.tags && post.tags.includes(tag));
		}

		if (author) {
			sortedPosts = sortedPosts.filter((post) => post.author && post.author.includes(author));
		}

		if (offset > 0) {
			sortedPosts = sortedPosts.slice(offset);
		}

		if (limit > 0 && limit < sortedPosts.length) {
			sortedPosts = sortedPosts.slice(0, limit);
		}

		const postsWithLinks = sortedPosts.map((post) => ({ ...post }));

		return {
			posts: postsWithLinks,
			total: validPosts.length
		};
	} catch (error) {
		console.error('Error fetching posts:', error);
		throw new Error('Error fetching posts');
	}
};
