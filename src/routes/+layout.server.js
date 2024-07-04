// Import necessary configurations and functions from your library
import { postsPerPage } from '$lib/data/config';
import fetchPosts from '$lib/data/fetchPosts';
import { VERCEL_COMMIT_REF } from '$env/static/private';

// The loadPosts function is declared with the data type imported from $types
/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  try {
    // Call fetchPosts function to get list of posts
    const posts = await fetchPosts();
    return {
      // Returns posts limited to postsPerPage
      posts: posts.slice(0, postsPerPage)
    };
  } catch (error) {
    console.error('Failed to load posts:', error);
    // Returns an error if the list of posts cannot be retrieved
    return {
      posts: [],
      error: 'Failed to load posts'
    };
  }
}

// The loadDeploymentInfo function is declared with the data type imported from $types
/** @type {import('./$types').LayoutServerLoad} */
export function load({ params }) {
  return {
    // Returns current Git branch information
    deploymentGitBranch: VERCEL_COMMIT_REF,
  };
}