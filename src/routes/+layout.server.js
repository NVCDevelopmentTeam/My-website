// Import necessary configurations and functions from your library
import { postsPerPage } from '$lib/data/config';
import fetchPosts from '$lib/data/fetchPosts';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ params }) {
  try {
    // Call fetchPosts function to get list of posts
    const posts = await fetchPosts();
    return {
      // Returns posts limited to postsPerPage
      posts: posts.slice(0, postsPerPage),
      // Returns current Git branch information
      deploymentGitBranch: process.env.VERCEL_COMMIT_REF || 'default_commit_ref',
    };
  } catch (error) {
    console.error('Failed to load posts:', error);
    // Returns an error if the list of posts cannot be retrieved
    return {
      posts: [],
      error: 'Failed to load posts',
      deploymentGitBranch: process.env.VERCEL_COMMIT_REF || 'default_commit_ref',
    };
  }
}
