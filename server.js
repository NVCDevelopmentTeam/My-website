import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { handler } from './build/handler.js';
import { attachSockets } from './sockets.js'; // Import the function from sockets.js

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Attach sockets to the server
attachSockets(io);

// Use handler from build folder
app.use(handler);

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
