import { json } from '@sveltejs/kit';
import { parse } from 'node-html-parser';
import readingTime from 'reading-time/lib/reading-time.js';

// Use import.meta.glob to get all Markdown files
const postModules = import.meta.glob('/src/lib/posts/**/*.md', { eager: true });

function stripMarkdown(markdown) {
  if (typeof markdown !== 'string') {
    return '';
  }

  const patterns = {
    code: /```[\s\S]*?```/gm,
    inline: /`([^`]+)`/g,
    heading: /^#{1,6}\s+.+$/gm,
    link: /\[([^\]]+)\]\(([^)]+)\)/g,
    image: /!\[([^\]]*)\]\(([^)]+)\)/g,
    blockquote: /^>\s.+$/gm,
    bold: /\*\*(.+?)\*\*/g,
    italic: /_(.+?)_/g,
    htmlTags: /<[^>]+>/g,
  };

  for (const [key, pattern] of Object.entries(patterns)) {
    markdown = markdown.replace(pattern, (match, p1) => {
      if (key === 'link' || key === 'image') return p1 || '';
      if (key === 'bold' || key === 'italic') return p1;
      return '';
    });
  }

  return markdown.trim();
}

export async function GET({ url }) {
  const query = url.searchParams.get('q') || '';
  const category = url.searchParams.get('category') || '';
  const tag = url.searchParams.get('tag') || '';
  const author = url.searchParams.get('author') || '';

  // Fetch and process all posts
  const posts = await Promise.all(
    Object.entries(postModules).map(async ([filepath, module]) => {
      const { metadata, default: content } = module;
      const html = parse(content.render().html);
      const previewElement = metadata.preview ? parse(metadata.preview) : html.querySelector('p');
      const previewText = previewElement ? previewElement.textContent : '';
      const structuredText = html.textContent || '';
      const slug = filepath.replace(/(\/index)?\.md/, '').split('/').pop();

      return {
        ...metadata,
        slug,
        preview: {
          html: previewElement ? previewElement.toString() : '',
          text: previewText
        },
        readingTime: readingTime(structuredText).text,
        content: stripMarkdown(content),
      };
    })
  );

  // Filter and sort posts
  const filteredPosts = posts
    .filter(post => {
      const isPublished = new Date() >= new Date(post.date);
      const matchesQuery = query === '' || 
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.preview.text.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === '' || (post.categories && post.categories.includes(category));
      const matchesTag = tag === '' || (post.tags && post.tags.includes(tag));
      const matchesAuthor = author === '' || (post.author && post.author.includes(author));

      return isPublished && !post.hidden && matchesQuery && matchesCategory && matchesTag && matchesAuthor;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Prepare the response
  const searchResults = filteredPosts.map(post => ({
    title: post.title,
    slug: post.slug,
    date: post.date,
    preview: post.preview,
    readingTime: post.readingTime,
    categories: post.categories || [],
    tags: post.tags || [],
    author: post.author
  }));

  return json({
    results: searchResults,
    count: searchResults.length
  });
}