import { postsPerPage } from '/config';
import { parseMD } from './parseMD';

export async function fetchPosts() {
  const posts = await Promise.all(
    Object.entries(import.meta.glob('/src/lib/posts/*.md')).map(
      async ([path, resolver]) => {
        console.log(path);
        const { default: raw } = await resolver();
        const { metadata } = parseMD(raw);
        console.log(metadata);
        const slug = path.split('/').pop().slice(0, -3);
        return { ...metadata, slug };
      }
    )
  );

  return posts;
}