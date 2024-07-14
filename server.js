import { handler } from './build/handler.js';
import express from 'express';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

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

app.use(handler);

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
