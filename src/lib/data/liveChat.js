import { io } from 'socket.io-client';

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
	}

	async initSocket() {
		if (!this.socket) {
			this.socket = io(this.SOCKET_URL, {
				reconnection: true,
				autoConnect: true
			});
			await new Promise((resolve, reject) => {
				this.socket.on('connect', () => resolve(this.socket));
				this.socket.on('connect_error', (error) => {
					console.error('Socket connection error:', error);
					reject(error);
				});
				this.socket.on('callRequest', (data) => {
					const { callerId, type } = data;
					this.currentCallData = { callerId, type };
					this.acceptCall();
				});
				this.socket.on('iceCandidate', (data) => {
					if (this.peerConnection && data.targetId === this.socket.id) {
						this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
					}
				});
			});
		}
		return this.socket;
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
			this.peerConnection = new RTCPeerConnection();
			this.localStream = await this.requestMedia(type);
			this.callType = type;
			this.localStream
				.getTracks()
				.forEach((track) => this.peerConnection.addTrack(track, this.localStream));
			const offer = await this.peerConnection.createOffer();
			await this.peerConnection.setLocalDescription(offer);
			this.socket.emit('offer', { targetId: this.currentCallData.callerId, offer });
			this.socket.once('answer', async (data) => {
				const { answer } = data;
				await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
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
				this.inCall = true;
			});
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
			this.peerConnection = new RTCPeerConnection();
			this.localStream = await this.requestMedia(type);
			this.callType = type;
			this.localStream
				.getTracks()
				.forEach((track) => this.peerConnection.addTrack(track, this.localStream));
			this.socket.once('offer', async (data) => {
				const { offer } = data;
				await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
				const answer = await this.peerConnection.createAnswer();
				await this.peerConnection.setLocalDescription(answer);
				this.socket.emit('answer', { targetId: callerId, answer });
				this.peerConnection.onicecandidate = (event) => {
					if (event.candidate) {
						this.socket.emit('iceCandidate', { targetId: callerId, candidate: event.candidate });
					}
				};
				this.peerConnection.ontrack = (event) => {
					if (!this.remotestream) {
						this.remotestream = event.streams[0];
						this.playRemoteStream(this.remotestream);
					}
				};
				this.inCall = true;
			});
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
				remoteMediaElement.srcObject = null;
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
		let remoteMediaElement =
			this.callType === 'video'
				? document.getElementById('remoteVideo')
				: document.getElementById('remoteAudio');
		if (!remoteMediaElement) {
			remoteMediaElement = document.createElement(this.callType === 'video' ? 'video' : 'audio');
			remoteMediaElement.id = this.callType === 'video' ? 'remoteVideo' : 'remoteAudio';
			remoteMediaElement.autoplay = true;
			document.body.appendChild(remoteMediaElement);
		}
		remoteMediaElement.srcObject = stream;
		remoteMediaElement.play();
	}
}

let liveChatInstance = null;

export const initSocket = async (serverUrl) => {
	if (!liveChatInstance) {
		liveChatInstance = new LiveChat(serverUrl);
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
