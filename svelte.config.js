// import mdsvex and adapter from the respective packages
import {mdsvex} from 'mdsvex';
import adapter from '@sveltejs/adapter-auto';

// create a configuration object for sveltekit
const config = {
// specify file extensions to be used by sveltekit and mdsvex
extensions: ['.svelte', '.md', '.svx'],

// add mdsvex to sveltekit preprocessing
preprocess: [
mdsvex ({
// specify file extensions to be used by mdsvex
extensions: ['.md', '.svx'],
})
],

// configure adapter for sveltekit
kit: {
// use automatic adapters to match your environment
adapter: adapter()
}
};

// export configuration object
export default config;