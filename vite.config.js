import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { Server } from 'socket.io'; // Import Server from socket.io
import { attachSockets } from './sockets'; // Import attachSockets from sockets.js

const socketIoPlugin = {
  name: 'socket-io-plugin',
  configureServer(server) {
    if (server.httpServer) {
      // Attach sockets to the HTTP server
      attachSockets(server.httpServer);
    } else {
      console.error('HTTP server not available for socket.io');
    }
  },
};

export default defineConfig({
  plugins: [sveltekit(), socketIoPlugin],
  server: {
    fs: {
      allow: ['.']
    }
  }
});
