import { json } from '@sveltejs/kit';
import { postsPerPage } from '$lib/data/config';
import fetchPosts from '$lib/data/fetchPosts';
import { parse } from 'node-html-parser';
import readingTime from 'reading-time/lib/reading-time.js';
import { browser } from '$app/environment';

export const prerender = true;

// Ensure this code only runs on the server-side
if (browser) {
	throw new Error('Posts can only be imported server-side');
}

// Patterns to remove unnecessary Markdown elements
const patterns = {
	frontmatter: /---.*?---/gs,
	code: /```[\s\S]*?```/g,
	inline: /`([^`]*)`/g,
	heading: /^#{1,6}\s.*$/gm,
	link: /\[([^\]]+)\]\(([^)]+)\)/g,
	image: /\!\[.*?\]\(.*?\)/g,
	blockquote: /> /gm,
	bold: /\*\*([^*]+)\*\*/g,
	italic: /\b_([^_]+)_(?!\w)/g,
	special: /{%.*?%}/g,
	tags: /[<>]/g
};

const htmlEntities = {
	'<': '&lt;',
	'>': '&gt;'
};

function stripMarkdown(markdown) {
	for (const pattern in patterns) {
		switch (pattern) {
			case 'inline':
				markdown = markdown.replace(patterns[pattern], '$1');
				break;
			case 'tags':
				markdown = markdown.replace(patterns[pattern], (match) => htmlEntities[match]);
				break;
			case 'link':
				markdown = markdown.replace(patterns[pattern], '$2');
				break;
			case 'italic':
				markdown = markdown.replace(patterns[pattern], '$1');
				break;
			default:
				markdown = markdown.replace(patterns[pattern], '');
		}
	}
	return markdown.trim();
}

export async function GET({ url }) {
	const query = url.searchParams.get('q') || '';
	const category = url.searchParams.get('category') || '';
	const tag = url.searchParams.get('tag') || '';
	const author = url.searchParams.get('author') || '';
	const offset = Number(url.searchParams.get('offset') || 0);
	const limit = Number(url.searchParams.get('limit') || postsPerPage);

	try {
		// Fetch all posts
		const fetchedPosts = await fetchPosts({ offset, limit, category, author, tag });

		if (!fetchedPosts || !fetchedPosts.posts) {
			throw new Error('Failed to fetch posts: Invalid data');
		}

		const { posts } = fetchedPosts;

		// Process and strip unnecessary Markdown
		const processedPosts = posts.map((post) => {
			const html = parse(post.content);
			post.content = stripMarkdown(html.structuredText);
			post.readingTime = readingTime(post.content).text;

			// Use a trimmed version of the content for preview if not already provided
			post.preview.text = post.preview.text || post.content.substring(0, 200) + '...';

			return post;
		});

		// Filter posts based on the search query and other parameters
		const filteredPosts = processedPosts
			.filter((post) => {
				const isPublished = new Date() >= new Date(post.date);
				const matchesQuery =
					query === '' ||
					post.title.toLowerCase().includes(query.toLowerCase()) ||
					post.content.toLowerCase().includes(query.toLowerCase());
				const matchesCategory = category === '' || post.categories?.includes(category);
				const matchesTag = tag === '' || post.tags?.includes(tag);
				const matchesAuthor = author === '' || post.author?.includes(author);

				return (
					isPublished &&
					!post.hidden &&
					matchesQuery &&
					matchesCategory &&
					matchesTag &&
					matchesAuthor
				);
			})
			.sort((a, b) => new Date(b.date) - new Date(a.date))
			.slice(offset, limit);

		// Return the filtered search results as JSON
		return json({
			results: filteredPosts,
			count: filteredPosts.length
		});
	} catch (error) {
		console.error('Error fetching posts:', error);
		return json({ error: `Failed to fetch posts: ${error.message}` }, { status: 500 });
	}
}
