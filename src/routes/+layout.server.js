import {postsPerPage} from '$lib/data/config'

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  return {
    posts: posts.slice(0, 5)
  }
import { VERCEL_COMMIT_REF } from '$env/static/private';
 
/** @type {import('./$types').LayoutServerLoad} */
export function load() {
  return {
    deploymentGitBranch: VERCEL_COMMIT_REF,
  };
}