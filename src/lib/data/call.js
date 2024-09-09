import Peer from 'peerjs';

let peer;
let currentCall;
let localStream;
let remoteStream;
let callType = 'voice'; // Default to 'voice', can be 'video'

/**
 * Initialize PeerJS connection
 * @param {string} userId - User ID for the connection
 */
export function initPeer(userId) {
    peer = new Peer(userId, {
        host: 'your-peer-server.com', // Replace with your PeerJS server
        port: 9000,
        path: '/peerjs',
        secure: true // Set to true if using HTTPS
    });

    peer.on('open', () => {
        console.log(`PeerJS connected with ID: ${peer.id}`);
    });

    peer.on('call', handleIncomingCall);
}

/**
 * Request media access (microphone, webcam)
 * @param {string} type - The type of media ('voice' or 'video')
 * @returns {Promise<MediaStream>}
 */
export async function requestMedia(type = 'voice') {
    const constraints = type === 'video' ? { video: true, audio: true } : { audio: true };
    try {
        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        return localStream;
    } catch (error) {
        console.error('Error accessing media devices:', error);
        throw new Error('Unable to access media devices.');
    }
}

/**
 * Start a call to another user
 * @param {string} userId - The ID of the user to call
 * @param {string} type - 'voice' or 'video'
 */
export async function startCall(userId, type = 'voice') {
    callType = type;
    if (!peer) {
        throw new Error('PeerJS not initialized.');
    }

    try {
        const stream = await requestMedia(type);
        currentCall = peer.call(userId, stream);
        setupCallHandlers(currentCall);
        return stream;
    } catch (error) {
        console.error('Error starting call:', error);
        throw error;
    }
}

/**
 * Handle an incoming call
 * @param {MediaConnection} call - The incoming call object
 */
async function handleIncomingCall(call) {
    currentCall = call;
    try {
        const stream = localStream || await requestMedia(callType);
        call.answer(stream);
        setupCallHandlers(call);
    } catch (error) {
        console.error('Error handling incoming call:', error);
        call.close();
    }
}

/**
 * Set up handlers for the ongoing call
 * @param {MediaConnection} call - The call object
 */
function setupCallHandlers(call) {
    call.on('stream', (stream) => {
        console.log('Received remote stream.');
        remoteStream = stream;
        playRemoteStream(remoteStream);
    });

    call.on('close', () => {
        console.log('Call ended.');
        endCall();
    });

    call.on('error', (error) => {
        console.error('Error during the call:', error);
        endCall();
    });
}

/**
 * End the current call
 */
export function endCall() {
    if (currentCall) {
        currentCall.close();
    }

    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }

    if (remoteStream) {
        remoteStream.getTracks().forEach(track => track.stop());
        remoteStream = null;
    }

    currentCall = null;
    console.log('Call ended.');
}

/**
 * Mute/unmute the local audio stream
 */
export function toggleMute() {
    if (localStream) {
        localStream.getAudioTracks().forEach(track => {
            track.enabled = !track.enabled;
        });
    }
}

/**
 * Turn on/off the local video stream
 */
export function toggleVideo() {
    if (localStream) {
        localStream.getVideoTracks().forEach(track => {
            track.enabled = !track.enabled;
        });
    }
}

/**
 * Play the remote stream in the UI
 * @param {MediaStream} stream - The remote media stream
 */
function playRemoteStream(stream) {
    const remoteMediaElement = callType === 'video' ? document.getElementById('remoteVideo') : document.getElementById('remoteAudio');
    if (remoteMediaElement) {
        remoteMediaElement.srcObject = stream;
        remoteMediaElement.play();
    } else {
        console.error('Remote media element not found.');
    }
}
