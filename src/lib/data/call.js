import { openDB } from '$lib/data/database';
import Peer from 'peerjs';

let peer;
let peerId;

// Initialize PeerJS connection
export function connectPeer(onPeerOpen, onCall) {
    peer = new Peer();

    peer.on('open', id => {
        peerId = id;
        onPeerOpen(id);
    });

    peer.on('call', call => {
        onCall(call);
    });
}

// Make a call to a remote peer
export function makeCall(remotePeerId, stream, onRemoteStream) {
    const call = peer.call(remotePeerId, stream);
    call.on('stream', remoteStream => {
        onRemoteStream(remoteStream);
    });
}

// Start a video call
export function startVideoCall(remotePeerId, handleRemoteStream) {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            makeCall(remotePeerId, stream, handleRemoteStream);
        })
        .catch(error => {
            console.error('Failed to start video call:', error);
        });
}

// Start a voice call
export function startVoiceCall(remotePeerId, handleRemoteStream) {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            makeCall(remotePeerId, stream, handleRemoteStream);
        })
        .catch(error => {
            console.error('Failed to start voice call:', error);
        });
}
