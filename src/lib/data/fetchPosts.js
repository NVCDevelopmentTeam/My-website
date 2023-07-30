import { postsPerPage } from '$lib/config';
import { parseMD } from '$lib/posts/parseMD';

export async function fetchPosts() {
  const postPaths = Object.keys(import.meta.globEager('$lib/posts/*.md'));
  const posts = await Promise.all(
    postPaths.map(async (path) => {
      const raw = await import(`$lib/posts/${path.slice(12)}`);
      const metadata = parseMD(raw.default); // Use raw.default since it's an ESM import
      const slug = path.split('/').pop().slice(0, -3);
      return {
        ...metadata,
        slug,
      };
    })
  );

  return posts.slice(0, postsPerPage);
}
