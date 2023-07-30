import { postsPerPage } from '/config';
import { parseMD } from '$lib/posts/parseMD';

export async function fetchPosts() {
  const postPaths = Object.keys(import.meta.globEager('$lib/posts/*.md'));
  const posts = await Promise.all(
    postPaths.map(async (path) => {
      const { default: raw } = await import(`${path}?raw`); // Add '?raw' to import the raw file content
      const metadata = parseMD(raw);
      const slug = path.split('/').pop().slice(0, -3);
      return {
        ...metadata,
        slug,
      };
    })
  );

  return posts.slice(0, postsPerPage);
}
