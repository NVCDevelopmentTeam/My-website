import { postsPerPage } from '/config';
import { parseMD } from '$lib/posts/parseMD';
import md from 'rollup-plugin-md';

export async function fetchPosts() {
  const postPaths = Object.keys(import.meta.globEager('$lib/posts/*.md'));
  const posts = await Promise.all(
    postPaths.map(async (path) => {
      const raw = await import(`${path}`);
      const metadata = parseMD(raw); // Use raw since it's an ES6 import
      const slug = path.split('/').pop().slice(0, -3);
      return {
        ...metadata,
        slug,
      };
    })
  );

  return posts.slice(0, postsPerPage);
}