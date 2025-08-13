import io from 'socket.io-client';

class LiveChatManager {
	constructor() {
		this.socket = null;
		this.isConnected = false;
		this.userInfo = null;
		this.mediaStream = null;
		this.peerConnection = null;
		this.isCallActive = false;
		this.isVideoCall = false;
		this.audioContext = null;
		this.soundEffects = {};
		
		this.initializeSoundEffects();
	}

	// Initialize sound effects for notifications
	async initializeSoundEffects() {
		try {
			this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
			
			// Load sound effects
			this.soundEffects = {
				incomingCall: await this.loadSound('/src/lib/sounds/incoming-call.mp3'),
				outgoingCall: await this.loadSound('/src/lib/sounds/outgoing-call.mp3'),
				messageReceived: await this.loadSound('/src/lib/sounds/message-received.mp3'),
				messageSent: await this.loadSound('/src/lib/sounds/message-sent.mp3'),
				callEnd: await this.loadSound('/src/lib/sounds/call-end.mp3')
			};
		} catch (error) {
			console.warn('Could not initialize sound effects:', error);
		}
	}

	async loadSound(url) {
		try {
			const response = await fetch(url);
			const arrayBuffer = await response.arrayBuffer();
			return await this.audioContext.decodeAudioData(arrayBuffer);
		} catch (error) {
			console.warn(`Could not load sound: ${url}`, error);
			return null;
		}
	}

	playSound(soundName) {
		if (!this.audioContext || !this.soundEffects[soundName]) return;
		
		try {
			const source = this.audioContext.createBufferSource();
			source.buffer = this.soundEffects[soundName];
			source.connect(this.audioContext.destination);
			source.start();
		} catch (error) {
			console.warn(`Could not play sound: ${soundName}`, error);
		}
	}

	// Announce to screen reader
	announceToScreenReader(message) {
		if (typeof window === 'undefined') return;
		
		let liveRegion = document.getElementById('chat-live-region');
		if (!liveRegion) {
			liveRegion = document.createElement('div');
			liveRegion.id = 'chat-live-region';
			liveRegion.setAttribute('aria-live', 'polite');
			liveRegion.setAttribute('aria-atomic', 'true');
			liveRegion.className = 'sr-only';
			document.body.appendChild(liveRegion);
		}
		
		liveRegion.textContent = message;
	}

	// Validate user information form
	validateUserInfo(userInfo) {
		const errors = {};
		
		if (!userInfo.name || userInfo.name.trim().length < 2) {
			errors.name = 'Tên phải có ít nhất 2 ký tự';
		}
		
		if (!userInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
			errors.email = 'Email không hợp lệ';
		}
		
		if (!userInfo.phone || !/^[0-9+\-\s()]{10,15}$/.test(userInfo.phone.replace(/\s/g, ''))) {
			errors.phone = 'Số điện thoại không hợp lệ';
		}
		
		if (!userInfo.initialMessage || userInfo.initialMessage.trim().length < 5) {
			errors.initialMessage = 'Tin nhắn đầu tiên phải có ít nhất 5 ký tự';
		}
		
		return {
			isValid: Object.keys(errors).length === 0,
			errors
		};
	}

	// Initialize chat connection with user info
	async initializeChat(userInfo) {
		const validation = this.validateUserInfo(userInfo);
		if (!validation.isValid) {
			throw new Error('Thông tin không hợp lệ: ' + Object.values(validation.errors).join(', '));
		}

		this.userInfo = userInfo;
		
		try {
			this.socket = io('http://localhost:3000', {
				reconnectionAttempts: 5,
				reconnectionDelay: 1000,
				auth: {
					userInfo: this.userInfo
				}
			});

			this.setupSocketListeners();
			
			return new Promise((resolve, reject) => {
				this.socket.on('connect', () => {
					this.isConnected = true;
					this.announceToScreenReader('Đã kết nối với hệ thống chat');
					console.log('Connected to chat server');
					resolve();
				});

				this.socket.on('connect_error', (err) => {
					this.announceToScreenReader('Lỗi kết nối chat');
					console.error('Connection Error:', err.message);
					reject(err);
				});
			});
		} catch (error) {
			this.announceToScreenReader('Không thể kết nối chat');
			throw error;
		}
	}

	setupSocketListeners() {
		if (!this.socket) return;

		// Message handling
		this.socket.on('chat message', (data) => {
			this.playSound('messageReceived');
			this.announceToScreenReader(`Tin nhắn mới từ ${data.sender}: ${data.message}`);
		});

		// Call handling
		this.socket.on('incoming call', (data) => {
			this.playSound('incomingCall');
			this.announceToScreenReader(`Cuộc gọi ${data.type === 'video' ? 'video' : 'thoại'} đến từ admin`);
		});

		this.socket.on('call answered', () => {
			this.isCallActive = true;
			this.announceToScreenReader('Cuộc gọi đã được trả lời');
		});

		this.socket.on('call ended', () => {
			this.endCall();
			this.playSound('callEnd');
			this.announceToScreenReader('Cuộc gọi đã kết thúc');
		});

		// Admin status
		this.socket.on('admin status', (status) => {
			this.announceToScreenReader(`Admin ${status.online ? 'đang online' : 'offline'}`);
		});
	}

	// Send message
	sendMessage(message) {
		if (!this.socket || !this.isConnected) {
			throw new Error('Chưa kết nối với server');
		}

		if (!message.trim()) {
			throw new Error('Tin nhắn không được để trống');
		}

		this.socket.emit('chat message', {
			message: message.trim(),
			timestamp: new Date().toISOString(),
			sender: this.userInfo.name
		});

		this.playSound('messageSent');
		this.announceToScreenReader('Tin nhắn đã được gửi');
	}

	// Request media permissions
	async requestMediaPermissions(includeVideo = false) {
		try {
			const constraints = {
				audio: {
					echoCancellation: true,
					noiseSuppression: true,
					autoGainControl: true
				}
			};

			if (includeVideo) {
				constraints.video = {
					width: { ideal: 1280 },
					height: { ideal: 720 },
					frameRate: { ideal: 30 }
				};
			}

			// Request microphone and camera permissions
			this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
			
			// Request speaker/audio output permission (if supported)
			if (navigator.mediaDevices.selectAudioOutput) {
				await navigator.mediaDevices.selectAudioOutput();
			}

			this.announceToScreenReader(`Đã cấp quyền truy cập ${includeVideo ? 'camera, micro và loa' : 'micro và loa'}`);
			return this.mediaStream;
		} catch (error) {
			const errorMessage = `Không thể truy cập ${includeVideo ? 'camera/micro' : 'micro'}: ${error.message}`;
			this.announceToScreenReader(errorMessage);
			throw new Error(errorMessage);
		}
	}

	// Start call (voice or video)
	async startCall(isVideo = false) {
		if (!this.socket || !this.isConnected) {
			throw new Error('Chưa kết nối với server');
		}

		if (this.isCallActive) {
			throw new Error('Đã có cuộc gọi đang diễn ra');
		}

		try {
			// Request media permissions
			await this.requestMediaPermissions(isVideo);
			
			this.isVideoCall = isVideo;
			this.playSound('outgoingCall');
			
			// Emit call request to server
			this.socket.emit('call request', {
				type: isVideo ? 'video' : 'voice',
				userInfo: this.userInfo
			});

			this.announceToScreenReader(`Đang gọi ${isVideo ? 'video' : 'thoại'} cho admin...`);
			
		} catch (error) {
			this.announceToScreenReader(`Lỗi khi bắt đầu cuộc gọi: ${error.message}`);
			throw error;
		}
	}

	// End call
	endCall() {
		if (this.mediaStream) {
			this.mediaStream.getTracks().forEach(track => track.stop());
			this.mediaStream = null;
		}

		if (this.peerConnection) {
			this.peerConnection.close();
			this.peerConnection = null;
		}

		if (this.socket && this.isCallActive) {
			this.socket.emit('call end');
		}

		this.isCallActive = false;
		this.isVideoCall = false;
		this.announceToScreenReader('Cuộc gọi đã kết thúc');
	}

	// Listen for messages
	onMessage(callback) {
		if (!this.socket) return;
		this.socket.on('chat message', callback);
	}

	// Listen for call events
	onCallEvent(event, callback) {
		if (!this.socket) return;
		this.socket.on(event, callback);
	}

	// Disconnect
	disconnect() {
		if (this.isCallActive) {
			this.endCall();
		}

		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
		}

		this.isConnected = false;
		this.userInfo = null;
		this.announceToScreenReader('Đã ngắt kết nối chat');
	}

	// Get connection status
	getStatus() {
		return {
			isConnected: this.isConnected,
			isCallActive: this.isCallActive,
			isVideoCall: this.isVideoCall,
			userInfo: this.userInfo
		};
	}
}

// Create singleton instance
const liveChatManager = new LiveChatManager();

export default liveChatManager;

// Export individual functions for backward compatibility
export function sendMessage(message) {
	return liveChatManager.sendMessage(message);
}

export function onMessage(callback) {
	return liveChatManager.onMessage(callback);
}
