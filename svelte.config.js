import adapter from '@sveltejs/adapter-node';
import { mdsvex } from 'mdsvex';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		mdsvex({
			extensions: ['.md'],
			rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings]
		})
	],
	kit: {
		adapter: adapter(),
		prerender: { entries: [] },
		alias: {
			$lib: path.resolve('src/lib'),
			$stores: path.resolve('src/stores'),
			$services: path.resolve('src/services'),
			$usecases: path.resolve('src/usecases'),
			$models: path.resolve('src/models')
		}
	}
};

export default config;
