import { postsPerPage } from '$lib/data/config';
import { paginate } from '$lib/data/utils';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, url, fetch }) {
  let page = params.page ? parseInt(params.page, 10) : 1;
  const limit = postsPerPage || 10;

  try {
    // Fetch all posts from the API
    const postRes = await fetch(`${url.origin}/api/posts.json`);
    if (!postRes.ok) {
      throw new Error('Failed to fetch posts');
    }
    const posts = await postRes.json();

    // Fetch total count of posts
    const totalRes = await fetch(`${url.origin}/api/posts/count`);
    if (!totalRes.ok) {
      throw new Error('Failed to fetch total posts count');
    }
    const total = await totalRes.json();

    // Paginate posts
    const postsForPage = paginate(posts, { limit, page });

    // Handle case where the requested page doesn't exist
    if (postsForPage.length === 0 && page > 1) {
      throw error(404, 'Page not found');
    }

    return {
      posts: postsForPage,
      page,
      limit,
      total
    };
  } catch (err) {
    console.error('Error fetching posts:', err);
    throw error(500, 'Internal Server Error');
  }
}
