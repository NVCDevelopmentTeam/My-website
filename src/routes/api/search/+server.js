import { json } from '@sveltejs/kit';
import { compile } from 'mdsvex';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import matter from 'gray-matter';

const patterns = {
  code: /```.*?\n|```/gs,
  inline: /`([^`]*)`/g,
  heading: /^#{1,6}\s.*$/gm,
  link: /\[([^\]]+)\]\(([^)]+)\)/g,
  image: /\!\[.*?\]\(.*?\)/g,
  blockquote: /> /gm,
  bold: /\*\*/g,
  italic: /\b_([^_]+)_(?!\w)/g,
  special: /{%.*?%}/g,
  tags: /[<>]/g,
};

const htmlEntities = {
  '<': '&lt;',
  '>': '&gt;',
};

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
        markdown = markdown.replace(patterns[pattern], '$2');
        break;
      case 'italic':
        markdown = markdown.replace(patterns[pattern], '$1');
        break;
      default:
        markdown = markdown.replace(patterns[pattern], '');
    }
  }
  return markdown;
}

export async function GET({ url }) {
  const query = url.searchParams.get('q');

  const paths = import.meta.glob('/src/lib/posts/*/**.md', { as: 'raw', eager: true });
  const posts = await Promise.all(
    Object.entries(paths).map(async ([_, content]) => {
      const { data, content: mdContent } = matter(content);
      if (data.draft) {
        return null;
      }

      const mdsvexContent = await compile(mdContent, {
        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
      });

      const strippedContent = stripMarkdown(mdsvexContent.code);

      return {
        title: data.title,
        slug: data.slug,
        content: strippedContent,
        description: data.description || '',
      };
    })
  );

  const filteredPosts = posts
    .filter(Boolean)
    .filter((post) => !query || post.title.includes(query) || post.content.includes(query));

  return json(filteredPosts);
}
