// Import necessary configurations and functions from your library
import { postsPerPage } from '$lib/data/config';
import fetchPosts from '$lib/data/fetchPosts';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
  try {
    // Call fetchPosts function to get list of posts
    const { posts } = await fetchPosts();

    // Ensure posts is an array
    const validPosts = Array.isArray(posts) ? posts : [];

    return {
      // Returns posts limited to postsPerPage
      posts: validPosts.slice(0, postsPerPage),
      // Returns current Git branch information
      deploymentGitBranch: process.env.VERCEL_COMMIT_REF || 'default_commit_ref'
    };
  } catch (error) {
    console.error('Failed to load posts:', error);

    return {
      posts: [],
      error: 'Failed to load posts',
      deploymentGitBranch: process.env.VERCEL_COMMIT_REF || 'default_commit_ref'
    };
  }
}
