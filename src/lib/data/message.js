import { openDB } from '$lib/data/database';
import io from 'socket.io-client';

let socket;
let messages = [];

// Connect to the Socket.io server
export function connectSocket(onReceiveMessage) {
    socket = io('http://localhost:3000'); // Replace with your server URL

    socket.on('receiveMessage', (data) => {
        onReceiveMessage(data);
    });
}

// Send a message to the server
export function sendMessageToServer(message, name) {
    socket.emit('sendMessage', { message, name });
}

// Initialize the chat connection and setup message reception
export function initChat(setMessagesCallback) {
    connectSocket((data) => {
        messages = [...messages, { text: data.message, self: false, name: 'Admin' }];
        setMessagesCallback(messages);
    });
}

// Start the chat with user information and initial messages
export function startChat(userInfo, setMessagesCallback) {
    if (userInfo.name && userInfo.emailOrPhone && userInfo.initialMessage) {
        messages = [
            ...messages,
            { text: userInfo.initialMessage, self: true, name: userInfo.name },
            { text: "Hello, it's nice to meet you. Is there anything I can help you with today?", self: false, name: 'Admin' }
        ];
        setMessagesCallback(messages);
    }
}

// Send a message and update the local message list
export function sendMessage(message, userInfo, setMessagesCallback) {
    if (message.trim()) {
        sendMessageToServer(message, userInfo.name);
        messages = [...messages, { text: message, self: true, name: userInfo.name }];
        setMessagesCallback(messages);
    }
}
