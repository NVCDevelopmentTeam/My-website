import { postsPerPage } from '$lib/data/config';
import fetchPosts from '$lib/data/fetchPosts';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const { post: slug } = params;

  try {
    // Get list of posts from fetchPosts
    const { posts } = await fetchPosts({ limit: -1 }); // `limit: -1` to get all posts

    // Find post with corresponding slug
    const post = posts.find((post) => post.slug === slug);

    if (!post) {
      throw error(404, 'Post not found');
    }

    return {
      post
    };
  } catch (err) {
    console.error('Error loading post:', err);
    throw error(500, 'Internal Server Error');
  }
}
