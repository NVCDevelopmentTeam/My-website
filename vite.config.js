import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { attachSockets } from './sockets.js'; // Ensure the correct path

const socketIoPlugin = {
	name: 'socket-io-plugin',
	configureServer(server) {
		if (server.httpServer) {
			// Attach sockets to the HTTP server
			attachSockets(server.httpServer);
		} else {
			console.error('HTTP server not available for socket.io');
		}
	}
};

export default defineConfig({
	plugins: [sveltekit(), socketIoPlugin],
	server: {
		fs: {
			allow: ['.']
		}
	},
	resolve: {
		alias: {
			$usecases: './src/usecases',
			$services: './src/services',
			$stores: './src/stores'
		}
	}
});
