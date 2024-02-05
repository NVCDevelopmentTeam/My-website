import { postsPerPage } from '$lib/data/config';
import { VERCEL_COMMIT_REF } from '$env/static/private';

/** @type {import('@sveltejs/kit').Load} */
export async function load({ page }) {
  const { path } = page;

  if (path === '/') {
    // Fetch posts and return the first 5 posts
    const posts = await fetchPosts();
    return {
      props: {
        posts: posts.slice(0, 5),
        deploymentGitBranch: VERCEL_COMMIT_REF
      }
    };
  } else {
    return {
      props: {
        deploymentGitBranch: VERCEL_COMMIT_REF
      }
    };
  }
}

async function fetchPosts() {
  // Implement your logic to fetch posts here
  // and return the posts array
}