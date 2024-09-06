import { postsPerPage } from '$lib/data/config'
import fetchPosts from '$lib/data/fetchPosts'
import { paginate } from '$lib/data/utils'
import { error, redirect } from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ url, params, fetch }) => {
  const page = parseInt(params.page) || 1

  // Avoid duplication with the blog's index page (page 1)
  if (page <= 1) {
    throw redirect(301, '/blog')
  }

  // Fetch total number of posts
  const totalPostsRes = await fetch(`${url.origin}/api/posts/count`)
  const total = await totalPostsRes.json()

  // Fetch all posts for this page (without paginating yet)
  const { posts } = await fetchPosts()

  // Use the paginate function to paginate posts
  const paginatedPosts = paginate(posts, { page, limit: postsPerPage })

  // If there are no posts for this page, error 404
  if (paginatedPosts.length === 0 && page > 1) {
    throw error(404, 'Page not found')
  }

  return {
    posts: paginatedPosts,
    page,
    totalPosts: total,
    postsPerPage
  }
}
