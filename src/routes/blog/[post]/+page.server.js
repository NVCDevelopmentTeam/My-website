import { postsPerPage } from '$lib/data/config';
import { fetchPosts } from '$lib/data/fetchPosts';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const { post: slug } = params;

  try {
    // Fetch all posts
    const data = await fetchPosts();

    // Kiểm tra xem data có chứa thuộc tính posts hay không
    const posts = data.posts || data;

    // Check if posts is actually an array
    if (!Array.isArray(posts)) {
      throw new Error('Fetched posts is not an array');
    }

    // Find the post with the matching slug
    const post = posts.find((p) => p.slug === slug);

    if (!post) {
      throw error(404, 'Post not found');
    }

    return {
      meta: post.meta,
      content: post.content,
      comments: post.comments,
      PostContent: post.PostContent // Ensure PostContent is passed correctly if necessary
    };
  } catch (err) {
    console.error(`Error loading post: ${err.message}`);
    throw error(500, 'Failed to load post');
  }
}
