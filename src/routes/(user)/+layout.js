import { error } from '@sveltejs/kit'

// Ensures all pages under this layout (which is all of them) are statically prerendered at build time 

/* TODO: I disabled it because of errors */

export const prerender = false;
// Allows client side routing. Necessary for page transitions and link prefetching; change to false if you prefer ordinary routing without JS
export const ssr = true;

export const load = async ({ url, fetch }) => {
	try {
		return {
			path: url.pathname
		}
	}
	catch(err) {
		error(500, err);
	}
}