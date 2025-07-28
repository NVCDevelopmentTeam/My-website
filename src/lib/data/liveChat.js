import { io } from 'socket.io-client';

const config = {
	iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }]
};

class LiveChat {
	constructor(serverUrl) {
		this.socket = null;
		this.peerConnection = null;
		this.localStream = null;
		this.remotestream = null;
		this.callType = null;
		this.inCall = false;
		this.currentCallData = null;
		this.SOCKET_URL = serverUrl;
		this.connectionState = 'disconnected';
		this.connectionAttempts = 0;
		this.maxRetries = 3;
		this.events = new EventTarget();
	}

	async initSocket() {
		if (this.connectionState === 'connecting') {
			throw new Error('Connection already in progress');
		}

		this.connectionState = 'connecting';

		try {
			if (!this.socket) {
				this.socket = io(this.SOCKET_URL, {
					reconnection: true,
					reconnectionAttempts: this.maxRetries,
					timeout: 10000,
					autoConnect: true,
					transports: ['websocket', 'polling']
				});

				this.setupSocketListeners();
			}

			return new Promise((resolve, reject) => {
				const timeout = setTimeout(() => {
					this.connectionState = 'failed';
					reject(new Error('Connection timeout'));
				}, 15000);

				this.socket.once('connect', () => {
					clearTimeout(timeout);
					this.connectionState = 'connected';
					this.connectionAttempts = 0;
					resolve(this.socket);
				});

				this.socket.once('connect_error', (error) => {
					clearTimeout(timeout);
					this.connectionState = 'failed';
					this.connectionAttempts++;
					reject(error);
				});
			});
		} catch (error) {
			this.connectionState = 'failed';
			throw error;
		}
	}

	setupSocketListeners() {
		this.socket.on('disconnect', () => {
			this.connectionState = 'disconnected';
			this.events.dispatchEvent(
				new CustomEvent('connectionStateChange', {
					detail: { state: 'disconnected' }
				})
			);
		});

		this.socket.on('error', (error) => {
			console.error('Socket error:', error);
			this.events.dispatchEvent(
				new CustomEvent('error', {
					detail: { error }
				})
			);
		});

		this.socket.io.on('reconnect_attempt', () => {
			this.connectionState = 'connecting';
			this.events.dispatchEvent(
				new CustomEvent('connectionStateChange', {
					detail: { state: 'connecting' }
				})
			);
		});

		this.socket.on('connect', () => {
			console.log('Socket connected');
		});
		this.socket.on('connect_error', (error) => {
			console.error('Socket connection error:', error);
		});

		this.socket.on('callRequest', (data) => {
			const { callerId, type } = data;
			this.currentCallData = { callerId, type };
			this.acceptCall();
		});

		this.socket.on('offer', async (data) => {
			const { offer, callerId } = data;
			this.currentCallData = { callerId, type: 'video' }; // Assuming video for offer, adjust if needed
			await this.handleIncomingOffer(offer, callerId);
		});

		this.socket.on('answer', async (data) => {
			const { answer } = data;
			if (this.peerConnection) {
				await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
			}
		});

		this.socket.on('iceCandidate', async (data) => {
			if (this.peerConnection) {
				try {
					await this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
				} catch (e) {
					console.error('Error adding received ICE candidate:', e);
				}
			}
		});

		this.socket.on('callEnded', () => {
			console.log('Call ended by remote peer.');
			this.endCall();
		});
	}

	cleanup() {
		if (this.socket) {
			this.socket.removeAllListeners();
			this.socket.disconnect();
			this.socket = null;
		}
		this.connectionState = 'disconnected';
		this.connectionAttempts = 0;
	}

	async handleIncomingOffer(offer, callerId) {
		try {
			this.peerConnection = new RTCPeerConnection(config);
			this.localStream = await this.requestMedia(this.currentCallData.type);
			this.localStream
				.getTracks()
				.forEach((track) => this.peerConnection.addTrack(track, this.localStream));

			this.peerConnection.onicecandidate = (event) => {
				if (event.candidate) {
					this.socket.emit('iceCandidate', {
						targetId: callerId,
						candidate: event.candidate
					});
				}
			};

			this.peerConnection.ontrack = (event) => {
				if (!this.remotestream) {
					this.remotestream = event.streams[0];
					this.playRemoteStream(this.remotestream);
				}
			};

			await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
			const answer = await this.peerConnection.createAnswer();
			await this.peerConnection.setLocalDescription(answer);
			this.socket.emit('answer', { targetId: callerId, answer });
			this.inCall = true;
		} catch (error) {
			console.error('Error handling incoming offer:', error);
			this.endCall();
		}
	}

	async joinRoom(roomId) {
		if (!this.socket) throw new Error('Socket not initialized');
		return new Promise((resolve, reject) => {
			this.socket.emit('join-room', roomId, (response) => {
				if (response.error) {
					reject(new Error(response.error));
				} else {
					resolve(response.users);
				}
			});
		});
	}

	sendMessage(roomId, message, sender) {
		if (!this.socket) throw new Error('Socket not initialized');
		this.socket.emit('chat-message', { roomId, message, sender });
	}

	onMessageReceived(roomId, callback) {
		if (!this.socket) throw new Error('Socket not initialized');
		this.socket.on('chat-message', (data) => {
			if (data.roomId === roomId) {
				callback(data);
			}
		});
	}

	async fetchChatBot(chatData) {
		try {
			const response = await fetch('/api/ChatBot', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify(chatData)
			});

			const result = await response.json();
			if (response.ok && result.success) {
				// status = result.message || 'Success';
			}
		} catch (error) {
			console.error('Error fetching chat bot response:', error);
		}
	}

	async fetchChatHistory(roomId) {
		const response = await fetch(`${this.SOCKET_URL}/api/chatHistory?roomId=${roomId}`, {
			method: 'GET'
		});
		if (!response.ok) {
			throw new Error('Failed to fetch chat history');
		}
		return await response.json();
	}

	async startCall(targetUserId, type = 'voice') {
		if (this.inCall) {
			throw new Error('Already in a call');
		}
		if (!this.socket) throw new Error('Socket not initialized');
		this.socket.emit('callRequest', { targetId: targetUserId, type });

		let cleanup;
		return new Promise((resolve, reject) => {
			const handleAccepted = async () => {
				try {
					await this.handleCallAccepted(type);
					resolve();
				} catch (error) {
					reject(error);
				}
			};
			const handleRejected = (reason) => {
				reject(new Error(`Call rejected: ${reason}`));
			};
			this.socket.once('callAccepted', handleAccepted);
			this.socket.once('callRejected', handleRejected);
			const timeOut = setTimeout(() => {
				reject(new Error('Call request timed out'));
			}, 10000);
			cleanup = () => {
				this.socket.off('callAccepted', handleAccepted);
				this.socket.off('callRejected', handleRejected);
				clearTimeout(timeOut);
			};
		}).finally(() => {
			if (cleanup) {
				cleanup();
			}
		});
	}

	async handleCallAccepted(type) {
		try {
			this.peerConnection = new RTCPeerConnection(config);
			this.localStream = await this.requestMedia(type);
			this.callType = type;
			this.localStream
				.getTracks()
				.forEach((track) => this.peerConnection.addTrack(track, this.localStream));

			this.peerConnection.onicecandidate = (event) => {
				if (event.candidate) {
					this.socket.emit('iceCandidate', {
						targetId: this.currentCallData.callerId,
						candidate: event.candidate
					});
				}
			};

			this.peerConnection.ontrack = (event) => {
				if (!this.remotestream) {
					this.remotestream = event.streams[0];
					this.playRemoteStream(this.remotestream);
				}
			};

			const offer = await this.peerConnection.createOffer();
			await this.peerConnection.setLocalDescription(offer);
			this.socket.emit('offer', { targetId: this.currentCallData.callerId, offer });
			this.inCall = true;
		} catch (error) {
			console.error('Error handling call acceptance:', error);
			this.endCall();
		}
	}

	acceptCall() {
		const { callerId } = this.currentCallData;
		this.socket.emit('callAccepted', { targetId: callerId });
		this.handleIncomingCall(this.currentCallData);
	}

	async handleIncomingCall(data) {
		const { callerId, type } = data;
		try {
			this.peerConnection = new RTCPeerConnection(config);
			this.localStream = await this.requestMedia(type);
			this.callType = type;
			this.localStream
				.getTracks()
				.forEach((track) => this.peerConnection.addTrack(track, this.localStream));

			this.peerConnection.onicecandidate = (event) => {
				if (event.candidate) {
					this.socket.emit('iceCandidate', {
						targetId: callerId,
						candidate: event.candidate
					});
				}
			};

			this.peerConnection.ontrack = (event) => {
				if (!this.remotestream) {
					this.remotestream = event.streams[0];
					this.playRemoteStream(this.remotestream);
				}
			};
			this.inCall = true;
		} catch (error) {
			console.error('Error handling incoming call:', error);
			this.endCall();
		}
	}

	async requestMedia(type = 'voice') {
		const constraints = type === 'video' ? { video: true, audio: true } : { audio: true };
		try {
			this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
			return this.localStream;
		} catch (error) {
			console.error('Error accessing media devices:', error);
			throw new Error('Unable to access media devices.');
		}
	}

	endCall() {
		if (this.peerConnection) {
			this.peerConnection.close();
			this.peerConnection = null;
		}
		if (this.localStream) {
			this.localStream.getTracks().forEach((track) => track.stop());
			this.localStream = null;
		}
		if (this.remotestream) {
			const remoteMediaElement =
				this.callType === 'video'
					? document.getElementById('remoteVideo')
					: document.getElementById('remoteAudio');
			if (remoteMediaElement) {
				/** @type {HTMLVideoElement | HTMLAudioElement} */ (remoteMediaElement).srcObject = null;
			}
			this.remotestream = null;
		}
		this.inCall = false;
	}

	toggleMute() {
		if (this.localStream) {
			this.localStream.getAudioTracks().forEach((track) => {
				track.enabled = !track.enabled;
			});
		}
	}

	toggleVideo() {
		if (this.localStream) {
			this.localStream.getVideoTracks().forEach((track) => {
				track.enabled = !track.enabled;
			});
		}
	}

	playRemoteStream(stream) {
		this.remotestream = stream;
	}

	getConnectionState() {
		return this.connectionState;
	}

	addEventListener(event, callback) {
		this.events.addEventListener(event, callback);
	}

	removeEventListener(event, callback) {
		this.events.removeEventListener(event, callback);
	}
}

let liveChatInstance = null;

export const initSocket = async () => {
	if (!liveChatInstance) {
		liveChatInstance = new LiveChat(
			import.meta.env.VITE_PUBLIC_SOCKET_URL || 'http://localhost:3000'
		);
	}
	return liveChatInstance.initSocket();
};

export const joinRoom = async (roomId) => {
	if (!liveChatInstance) throw new Error('LiveChat not initialized');
	return liveChatInstance.joinRoom(roomId);
};

export const sendMessage = async (roomId, message, sender) => {
	if (!liveChatInstance) throw new Error('LiveChat not initialized');
	liveChatInstance.sendMessage(roomId, message, sender);
};

export function onMessageReceived(roomId, callback) {
	if (!liveChatInstance) throw new Error('LiveChat not initialized');
	liveChatInstance.onMessageReceived(roomId, callback);
}

export async function fetchChatHistory(roomId) {
	if (!liveChatInstance) throw new Error('LiveChat not initialized');
	return liveChatInstance.fetchChatHistory(roomId);
}

export async function startCall(targetUserId, type = 'voice') {
	if (!liveChatInstance) throw new Error('LiveChat not initialized');
	return liveChatInstance.startCall(targetUserId, type);
}

export async function requestMedia(type = 'voice') {
	if (!liveChatInstance) throw new Error('LiveChat not initialized');
	return liveChatInstance.requestMedia(type);
}

export function endCall() {
	if (!liveChatInstance) throw new Error('LiveChat not initialized');
	liveChatInstance.endCall();
}

export function toggleMute() {
	if (!liveChatInstance) throw new Error('LiveChat not initialized');
	liveChatInstance.toggleMute();
}

export function toggleVideo() {
	if (!liveChatInstance) throw new Error('LiveChat not initialized');
	liveChatInstance.toggleVideo();
}
