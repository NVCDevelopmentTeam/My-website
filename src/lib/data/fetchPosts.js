import { postsPerPage } from '$lib/data/config';
import { parse } from 'node-html-parser';
import readingTime from 'reading-time/lib/reading-time.js';
import { browser } from '$app/environment';

// Ensure that this code runs only on the server-side
if (browser) {
  throw new Error(`Posts can only be imported server-side`);
}

const fetchPosts = async ({ offset = 0, limit = postsPerPage, category = '', author = '', tag = '' } = {}) => {
  // Fetch all posts
  const posts = await Promise.all(
    Object.entries(import.meta.glob('/src/lib/posts/**/*.md', { eager: true })).map(async ([filepath, post]) => {
      const html = parse(post.default.render().html);
      const previewElement = post.metadata.preview ? parse(post.metadata.preview) : html.querySelector('p');
      
      const previewText = previewElement ? previewElement.toString() : '';
      const structuredText = html.structuredText || '';

      return {
        ...post.metadata,
        slug: filepath
          .replace(/(\/index)?\.md/, '')
          .split('/')
          .pop(),
        preview: {
          html: previewText,
          text: previewElement ? previewElement.structuredText || previewText : previewText
        },
        readingTime: readingTime(structuredText).text
      };
    })
  );

  // Sort and filter posts
  let sortedPosts = posts
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .filter(post => category ? post.categories.includes(category) : true)
    .filter(post => tag ? post.tags.includes(tag) : true)
    .filter(post => author ? post.author.includes(author) : true)
    .slice(offset, limit !== -1 ? offset + limit : undefined)
    .map((post, index, allPosts) => ({
      ...post,
      next: allPosts[index - 1] ?? null,
      previous: allPosts[index + 1] ?? null
    }))
    .filter(post => {
      const isPublished = new Date() >= new Date(post.date);
      return isPublished && !post.hidden;
    });

  // Ensure data is serializable
  try {
    JSON.stringify(sortedPosts);
  } catch (error) {
    console.error('Error serializing data:', error);
  }

  return {
    posts: sortedPosts
  };
};

export default fetchPosts;
