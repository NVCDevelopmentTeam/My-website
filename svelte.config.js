import adapter from '@sveltejs/adapter-vercel';
import { mdsvex } from 'mdsvex';
import preprocess from 'svelte-preprocess';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';

const config = {
    extensions: ['.svelte', '.md'],
    preprocess: [
        preprocess()
    ],
    kit: {
        adapter: adapter(),
        prerender: {
            entries: [
                '',
                '/api/posts/page/',
                '/blog/category//page/',
                '/blog/category//page/',
                '/blog/category/page/',
                '/blog/category/page/',
                '/blog/page/',
                '/blog/page/*',
            ],
            runtime: 'nodejs18.x',
        },
    },
};

const mdsvexOptions = {
    extensions: ['.md'],
    rehypePlugins: [
        rehypeSlug,
        rehypeAutolinkHeadings,
    ],
};

export default mdsvex(config, mdsvexOptions);
