import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
const config = defineConfig({
plugins: [sveltekit()],
server: {
fs: {
allow: ['.'],
},
},
});
export default config;