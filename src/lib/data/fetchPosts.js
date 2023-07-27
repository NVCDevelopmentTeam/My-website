import { postsPerPage } from '/config';
import { parseMD } from './parseMD';

export async function fetchPosts() {
  const postPaths = await import.meta.globEager('/src/lib/posts/*.md');

  const posts = await Promise.all(
    postPaths.map(async (path) => {
      const raw = await import.meta.globEager(path);
      const metadata = parseMD(raw);
      const slug = path.split('/').pop().slice(0, -3);
      return { ...metadata, slug };
    })
  );

  return posts.slice(0, postsPerPage);
}