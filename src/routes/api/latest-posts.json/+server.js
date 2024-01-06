import { json } from '@sveltejs/kit';
import { postsPerPage } from '$lib/data/config';
import fetchPosts from '$lib/data/fetchPosts';

export async function GET({ query }) {
  // get the page number from the query string
  const page = query.get('page') || 1;

  // fetch the posts for the given page
  const posts = await fetchPosts(page);

  // return a JSON response with the posts and pagination info
  return json({
    posts,
    page,
    per_page: postsPerPage,
    total: posts.length
  });
}
