import io from 'socket.io-client';

let socket;
let messages = []; // Array to store chat messages

const SOCKET_URL = 'http://localhost:3000'; // Change to the correct backend URL if needed
const SOCKET_OPTIONS = {
  reconnection: true,
  reconnectionAttempts: 5, // Retry connection 5 times
  timeout: 10000 // 10 seconds timeout
};

/**
 * Connect to the socket server.
 * @param {Function} onReceiveMessage - Callback function to handle receiving new messages.
 * @returns {Promise} - Resolves when connected, rejects if there's an error.
 */
export function connectSocket(onReceiveMessage) {
  return new Promise((resolve, reject) => {
    if (!socket || !socket.connected) {
      // Establish connection with the server
      socket = io(SOCKET_URL, SOCKET_OPTIONS);

      socket.on('connect', () => {
        console.log('Connected to Socket.io server.');
        resolve(); // Connection successful
      });

      // Listen for 'chatMessage' event (corrected from 'receiveMessage')
      socket.on('chatMessage', (data) => {
        const newMessage = { text: data.message, self: false, name: data.user };
        messages = [...messages, newMessage]; // Append the new message
        onReceiveMessage(messages); // Update the UI with the new messages
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from Socket.io server.');
      });

      socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        reject(error); // Connection failed
      });

      socket.on('error', (error) => {
        console.error('Socket error:', error);
        reject(error); // General socket error
      });
    } else {
      resolve(); // Socket is already connected
    }
  });
}

/**
 * Send a chat message to the server.
 * @param {string} message - The message to be sent.
 * @param {string} name - The name of the sender.
 * @returns {Promise} - Resolves if the message is sent successfully, rejects otherwise.
 */
export function sendMessageToServer(message, name) {
  return new Promise((resolve, reject) => {
    if (socket?.connected) {
      // Emit 'chatMessage' event instead of 'sendMessage'
      socket.emit('chatMessage', { message, user: name }, (acknowledgement) => {
        if (acknowledgement?.success) {
          resolve(); // Message sent successfully
        } else {
          reject(new Error('Failed to send message')); // Message sending failed
        }
      });
    } else {
      reject(new Error('Socket is not connected.')); // Socket not connected
    }
  });
}

/**
 * Initialize the chat connection.
 * @param {Function} setMessagesCallback - Callback to update the chat UI.
 * @returns {Promise} - Resolves when the chat is initialized successfully.
 */
export async function initChat(setMessagesCallback) {
  try {
    await connectSocket(setMessagesCallback); // Connect to the socket
  } catch (error) {
    console.error('Failed to initialize chat:', error);
    throw error; // Propagate the error
  }
}

/**
 * Start a new chat session.
 * @param {Object} userInfo - Contains the name, email/phone, and initial message.
 * @param {Function} setMessagesCallback - Callback to update the chat UI.
 * @returns {Promise} - Resolves after the initial message is sent.
 */
export async function startChat(userInfo, setMessagesCallback) {
  if (!userInfo.name || !userInfo.emailOrPhone || !userInfo.initialMessage) {
    throw new Error('User information is incomplete.'); // Validate user info
  }

  // Create initial system messages
  const initialMessages = [
    { text: userInfo.initialMessage, self: true, name: userInfo.name },
    { text: "Hello, it's nice to meet you. Is there anything I can help you with today?", self: false, name: 'Admin' }
  ];
  messages = [...messages, ...initialMessages]; // Add initial messages
  setMessagesCallback(messages); // Update the chat UI

  try {
    await sendMessageToServer(userInfo.initialMessage, userInfo.name); // Send initial message to server
  } catch (error) {
    console.error('Failed to send initial message:', error);
    // Chat starts even if the initial message fails, no re-throw here
  }
}

/**
 * Send a new message from the client.
 * @param {string} message - The message to be sent.
 * @param {Object} userInfo - Contains the user's name.
 * @param {Function} setMessagesCallback - Callback to update the chat UI.
 */
export async function sendMessage(message, userInfo, setMessagesCallback) {
  if (!message.trim()) {
    throw new Error('Message is empty.'); // Ensure message isn't empty
  }

  const newMessage = { text: message, self: true, name: userInfo.name };
  messages = [...messages, newMessage]; // Add the new message to local array
  setMessagesCallback(messages); // Update the UI

  try {
    await sendMessageToServer(message, userInfo.name); // Send the message to server
  } catch (error) {
    console.error('Failed to send message:', error);
    // Show system error message if sending fails
    messages = [...messages, { text: "Failed to send message. Please try again.", self: false, name: "System" }];
    setMessagesCallback(messages); // Update UI with failure message
  }
}

/**
 * Check if the socket is currently connected.
 * @returns {boolean} - True if socket is connected, false otherwise.
 */
export function isSocketConnected() {
  return socket?.connected || false; // Return connection status
}
