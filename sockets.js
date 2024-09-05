import { Server } from 'socket.io'; // Import Server from socket.io

export function attachSockets(httpServer) {
  const io = new Server(httpServer);

  let visitsToday = 0;
  let totalVisits = 0;
  let totalVisitors = 0;
  let totalCountries = new Set();

  io.on('connection', (socket) => {
    visitsToday++;
    totalVisits++;
    totalVisitors++;

    const country = socket.handshake.headers['x-country'] || 'Unknown';
    totalCountries.add(country);

    io.emit('stats', {
      visitsToday,
      totalVisits,
      totalVisitors,
      totalCountries: totalCountries.size,
      countrySet: Array.from(totalCountries),
    });

    socket.on('disconnect', () => {
      totalVisitors--;
      io.emit('stats', {
        visitsToday,
        totalVisits,
        totalVisitors,
        totalCountries: totalCountries.size,
        countrySet: Array.from(totalCountries),
      });
    });
  });

  return io; // Return the io instance if needed
}