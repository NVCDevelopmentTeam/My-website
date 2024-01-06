import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import md from 'rollup-plugin-md';

export default defineConfig({
	plugins: [
		sveltekit(),
		md({
			output: 'html', // or 'svelte'
			preprocess: [
				// add your preprocessors here
			]
		})
	]
});
