import { postsPerPage } from './config';
import { parseMD } from '$lib/posts/parseMD';

export async function fetchPosts() {
  const postPaths = Object.keys(import.meta.globEager('../posts/*.md'));

  const posts = await Promise.all(
    postPaths.map(async (path) => {
      const raw = (await import(`../../posts/${path}`)).default;
      const metadata = parseMD(raw);
      const slug = path.split('/').pop().slice(0, -3);
      return { ...metadata, slug };
    })
  );

  return posts.slice(0, postsPerPage);
}