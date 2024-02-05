import { postsPerPage } from '$lib/data/config';
import fetchPosts from '$lib/data/fetchPosts';
import { VERCEL_COMMIT_REF } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function loadPosts() {
  const posts = await fetchPosts();
  return {
    posts: posts.slice(0, postsPerPage)
  }
}

/** @type {import('./$types').LayoutServerLoad} */
export function loadDeploymentInfo() {
  return {
    deploymentGitBranch: VERCEL_COMMIT_REF,
  };
}
