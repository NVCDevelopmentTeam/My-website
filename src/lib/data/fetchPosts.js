import { postsPerPage } from '/config';
import { parseMD } from './parseMD';

export async function fetchPosts() {
  const postPaths = Object.keys(import.meta.globEager('/src/lib/posts/*.md'));

  const posts = await Promise.all(
    postPaths.map(async (path) => {
      console.log(path);
      const resolver = import.meta.globEager(path);
      const { default: raw } = resolver;
      const { metadata } = parseMD(raw);
      console.log(metadata);
      const slug = path.split('/').pop().slice(0, -3);
      return { ...metadata, slug };
    })
  );

  return posts;
}