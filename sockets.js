import { Server } from 'socket.io';

// Function to attach sockets to the HTTP server
export function attachSockets(httpServer) {
	const io = new Server(httpServer, {
		cors: {
			origin: '*',
			methods: ['GET', 'POST']
		}
	});

	// Initialize statistics
	let stats = {
		visitsToday: 0,
		totalVisits: 0,
		totalVisitors: 0,
		totalCountries: new Set(),
		connectedClients: new Map()
	};

	// Handle new socket connections
	io.on('connection', (socket) => {
		handleNewConnection(socket);

		socket.on('chat-message', (data) => handleChatMessage(socket, data));
		socket.on('offer', (offer) => handleOffer(socket, offer));
		socket.on('answer', (answer) => handleAnswer(socket, answer));
		socket.on('iceCandidate', (candidate) => handleIceCandidate(socket, candidate));
		socket.on('disconnect', () => handleDisconnection(socket));
		socket.on('error', (error) => handleError(socket, error));
	});

	// Function to handle new connections
	function handleNewConnection(socket) {
		const { userType, userId, country = 'Unknown' } = socket.handshake.auth;

		// Validate userType and userId
		if (!['admin', 'user'].includes(userType) || !userId) {
			socket.disconnect(true);
			return;
		}

		// Update statistics
		stats.visitsToday++;
		stats.totalVisits++;
		stats.totalVisitors++;
		stats.totalCountries.add(country.toLowerCase());
		stats.connectedClients.set(userId, { userType, country });

		// Attach user data to the socket
		socket.userData = { userType, userId, country };

		console.log(`${userType} connected: ${userId} from ${country}`);

		// Send appropriate messages based on userType
		if (userType === 'admin') {
			socket.emit('stats-update', getFormattedStats());
		} else if (userType === 'user') {
			const roomId = userId;
			socket.join(roomId);
			socket.emit('chat-message', {
				message: 'Hello! You can start chatting with the admin.',
				sender: 'system'
			});
		}

		// Broadcast updated stats to all clients
		io.emit('stats-update', getFormattedStats());
	}

	// Function to handle chat messages
	function handleChatMessage(socket, data) {
		const { userType, userId } = socket.userData;
		const { roomId, message, sender } = data;

		// Validate roomId and message
		if (!roomId || !message) {
			socket.emit('chat-error', { error: 'Invalid message data' });
			return;
		}

		// Ensure users can only send messages to their own room
		if (userType === 'user' && roomId !== userId) {
			socket.emit('chat-error', { error: 'You cannot send messages to this room' });
			return;
		}

		// Emit the chat message to the specified room
		io.to(roomId).emit('chat-message', { sender: sender || userId, message });
		// Implement saveChatMessage function to persist chat messages if needed
		// saveChatMessage(roomId, sender || userId, message);
	}

	// Function to handle call offers
	function handleOffer(socket, { targetId, offer }) {
		const targetSocket = Array.from(io.sockets.sockets.values()).find(
			(s) => s.userData && s.userData.userId === targetId
		);
		if (targetSocket) {
			targetSocket.emit('offer', { offer, callerId: socket.userData.userId });
		} else {
			socket.emit('call-error', { error: 'Target user not found' });
		}
	}

	// Function to handle call answers
	function handleAnswer(socket, { targetId, answer }) {
		const targetSocket = Array.from(io.sockets.sockets.values()).find(
			(s) => s.userData && s.userData.userId === targetId
		);
		if (targetSocket) {
			targetSocket.emit('answer', { answer, answererId: socket.userData.userId });
		} else {
			socket.emit('call-error', { error: 'Target user not found' });
		}
	}

	// Function to handle ICE candidates
	function handleIceCandidate(socket, { targetId, candidate }) {
		const targetSocket = Array.from(io.sockets.sockets.values()).find(
			(s) => s.userData && s.userData.userId === targetId
		);
		if (targetSocket) {
			targetSocket.emit('iceCandidate', { candidate, from: socket.userData.userId });
		} else {
			socket.emit('call-error', { error: 'Target user not found for ICE candidate' });
		}
	}

	// Function to handle disconnections
	function handleDisconnection(socket) {
		const { userId, userType } = socket.userData;

		// Remove the client from connectedClients
		stats.connectedClients.delete(userId);
		console.log(`${userType} disconnected: ${userId}`);

		// Broadcast updated stats to all clients
		io.emit('stats-update', getFormattedStats());
	}

	// Function to handle errors
	function handleError(socket, error) {
		console.error(`Socket error (${socket.id}):`, error.message);
	}

	// Function to get formatted statistics
	function getFormattedStats() {
		return {
			visitsToday: stats.visitsToday,
			totalVisits: stats.totalVisits,
			totalVisitors: stats.totalVisitors,
			activeUsers: stats.connectedClients.size,
			totalCountries: stats.totalCountries.size,
			countries: Array.from(stats.totalCountries)
		};
	}

	// Periodically broadcast stats to all clients
	setInterval(() => {
		io.emit('stats-update', getFormattedStats());
	}, 10000);

	return io;
}
