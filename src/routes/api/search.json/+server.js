import { json } from '@sveltejs/kit';
import { compile } from 'mdsvex';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import matter from 'gray-matter';

// Define patterns to strip markdown
const patterns = {
  inline: /\*([^*]+)\*/g, // Inline code
  tags: /[<>]/g, // HTML tags
  link: /\[([^\]]+)]\([^)]+\)/g, // Markdown links
  italic: /\*([^*]+)\*/g, // Italic text
  // Add other patterns (e.g., headings, images, blockquotes)
};

// Define HTML entities
const htmlEntities = {
  '<': '&lt;',
  '>': '&gt;',
};

// Function to strip markdown content
function stripMarkdown(markdown) {
  for (const pattern in patterns) {
    switch (pattern) {
      case 'inline':
        markdown = markdown.replace(patterns[pattern], '$1');
        break;
      case 'tags':
        markdown = markdown.replace(
          patterns[pattern],
          (match) => htmlEntities[match]
        );
        break;
      case 'link':
        markdown = markdown.replace(patterns[pattern], '$1');
        break;
      case 'italic':
        markdown = markdown.replace(patterns[pattern], '$1');
        break;
      // Add handling for other patterns (e.g., headings, images)
      default:
        markdown = markdown.replace(patterns[pattern], '');
    }
  }
  return markdown;
}

// GET handler for search
export async function GET({ url }) {
  const query = url.searchParams.get('q')?.toLowerCase();

  // Import markdown files from the specified directory
  const paths = import.meta.glob('/src/lib/posts/*.md', { as: 'raw', eager: true });

  // Process the markdown files
  const posts = await Promise.all(
    Object.entries(paths).map(async ([_, content]) => {
      try {
        const { data, content: mdContent } = matter(content);

        // Skip draft posts
        if (data.draft) {
          return null;
        }

        // Compile markdown content
        const mdsvexContent = await compile(mdContent, {
          rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
        });

        // Strip markdown content
        const strippedContent = stripMarkdown(mdsvexContent.code);

        // Return post data
        return {
          title: data.title,
          slug: data.slug,
          content: strippedContent,
          description: data.description || '',
        };
      } catch (error) {
        console.error('Error processing content:', error);
        return null;
      }
    })
  );

  // Filter posts based on query
  const filteredPosts = posts
    .filter(Boolean)
    .filter(
      (post) =>
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query)
    );

  // Return the filtered posts as JSON
  return json(filteredPosts);
}
