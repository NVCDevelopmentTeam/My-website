import adapter from '@sveltejs/adapter-node'
import { mdsvex } from 'mdsvex'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Ensures both .svelte and .md files are treated as components (can be imported and used anywhere, or used as pages)
	extensions: ['.svelte', '.md'],

	preprocess: [
		mdsvex({
			// The default mdsvex extension is .svx; this overrides that.
			extensions: ['.md'],

			// Adds IDs to headings, and anchor links to those IDs. Note: must stay in this order to work.
			rehypePlugins: [
				rehypeSlug,
				rehypeAutolinkHeadings,
			],
		}),
	],

	kit: {
		adapter: adapter(),
    prerender: {
      entries: [
        '*',
        '/api/posts/page/*',
        '/api/latestPosts/*',
        '/blog/category/*/page/',
        '/blog/category/*/page/*',
        '/blog/category/page/',
        '/blog/category/page/*',
        '/blog/page/',
        '/blog/page/*',
        '/blog/tags/',
        '/blog/tags/*',
      ]
    }
	}
};

export default config;