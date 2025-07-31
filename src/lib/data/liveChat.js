import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
	reconnectionAttempts: 5,
	reconnectionDelay: 1000,
});

socket.on('connect', () => {
	console.log('Connected to chat server');
});

socket.on('connect_error', (err) => {
	console.error('Connection Error:', err.message);
});

export function sendMessage(message) {
	socket.emit('chat message', message);
}

export function onMessage(callback) {
	socket.on('chat message', callback);
}

export default socket;

