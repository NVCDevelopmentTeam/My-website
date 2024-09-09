import { Server } from 'socket.io';

export function attachSockets(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // Allow cross-origin requests if needed
      methods: ["GET", "POST"]
    }
  });

  // Stats object to hold visits and other details
  let stats = {
    visitsToday: 0,
    totalVisits: 0,
    totalCountries: new Set(),
    connectedClients: new Set(),
  };

  io.on('connection', (socket) => {
    handleNewConnection(socket, stats);

    // Handle receiving a chat message
    socket.on('chatMessage', (message) => handleChatMessage(io, socket, message));

    // Handle disconnect event
    socket.on('disconnect', () => handleDisconnection(io, socket, stats));

    // Handle socket errors
    socket.on('error', (error) => handleError(socket, error));
  });

  // Reset daily visits at midnight using setInterval
  setInterval(() => resetDailyVisits(stats), 24 * 60 * 60 * 1000);

  return io;
}

function handleNewConnection(socket, stats) {
  // Increment visit counts and track connected clients
  stats.visitsToday++;
  stats.totalVisits++;
  stats.connectedClients.add(socket.id);

  // Get country from headers, default to 'Unknown'
  const country = socket.handshake.headers['x-country'] || 'Unknown';
  stats.totalCountries.add(country);

  // Log the new connection and broadcast stats
  console.log(`New connection from ${country}. Total visits today: ${stats.visitsToday}`);
  broadcastStats(socket.server, stats);
}

function handleChatMessage(io, socket, message) {
  // Emit chat message to all connected clients
  io.emit('chatMessage', {
    user: socket.id,
    message,
    timestamp: new Date().toISOString(),
  });
  console.log(`Message from ${socket.id}: ${message}`);
}

function handleDisconnection(io, socket, stats) {
  // Remove client from connected clients set on disconnect
  stats.connectedClients.delete(socket.id);
  console.log(`Client ${socket.id} disconnected.`);
  broadcastStats(io, stats); // Update stats after disconnection
}

function handleError(socket, error) {
  // Log socket errors
  console.error(`Error from client ${socket.id}:`, error);
}

function broadcastStats(io, stats) {
  // Emit updated stats to all connected clients
  io.emit('stats', {
    visitsToday: stats.visitsToday,
    totalVisits: stats.totalVisits,
    totalVisitors: stats.connectedClients.size,
    totalCountries: stats.totalCountries.size,
    countrySet: Array.from(stats.totalCountries), // Convert Set to Array for broadcasting
  });
}

function resetDailyVisits(stats) {
  // Reset daily visits count and log the reset
  stats.visitsToday = 0;
  console.log('Daily visits reset.');
  // Optional: Persist totalVisits and totalCountries to a database
}
