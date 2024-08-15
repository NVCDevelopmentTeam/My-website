import { error } from '@sveltejs/kit';
import { parse } from 'node-html-parser';
import readingTime from 'reading-time/lib/reading-time.js';

// Use import.meta.glob to get all Markdown files
const postModules = import.meta.glob('/src/lib/posts/**/*.md', { eager: true });

export const load = async ({ params }) => {
  try {
    // Create Markdown file path from params.post
    const postFilePath = `/src/lib/posts/${params.post}.md`;

    // Check if file exists
    if (!postModules[postFilePath]) {
      console.error('Post file path not found:', postFilePath);
      throw new Error('Post not found');
    }

    const post = postModules[postFilePath];
    const markdownContent = post.default; // Contents of the Markdown file
    const html = parse(markdownContent);

    // Get preview from metadata or from Markdown content
    const previewHtml = post.metadata?.preview || html.querySelector('p')?.toString() || '';

    return {
      PostContent: markdownContent,
      meta: {
        ...post.metadata,
        slug: params.post,
        preview: {
          html: previewHtml,
          text: html.structuredText || ''
        },
        readingTime: readingTime(html.structuredText || '').text
      }
    };
  } catch (err) {
    console.error('Error loading post:', err);
    throw error(404, 'Post not found');
  }
};
