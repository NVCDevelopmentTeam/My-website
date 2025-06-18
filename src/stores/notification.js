import { writable } from 'svelte/store';

/**
 * @typedef {'success' | 'warning' | 'error' | 'info'} StatusType
 * @typedef {Object} Message
 * @property {number} id - Unique identifier for each message
 * @property {StatusType} status - Type of notification
 * @property {string} text - Notification text
 * @property {number} timeout - Duration in ms before auto remove
 */

/** Initial state with an empty messages array */
const initialState = { messages: [] };

/** Svelte writable store to hold notifications */
export const notificationStore = writable(initialState);

let nextId = 1;

/**
 * Add a new message to the store and auto-remove after timeout.
 * @param {Object} params
 * @param {StatusType} params.status
 * @param {string} params.text
 * @param {number} [params.timeout=3000]
 */
function addMessage({ status, text, timeout = 3000 }) {
  const id = nextId++;
  const message = { id, status, text, timeout };

  // Update store by appending the new message
  notificationStore.update(state => ({
    messages: [...state.messages, message]
  }));

  // Auto-remove the message after timeout if > 0
  if (timeout > 0) {
    setTimeout(() => {
      notificationStore.update(state => ({
        messages: state.messages.filter(m => m.id !== id)
      }));
    }, timeout);
  }
}

/**
 * Remove a specific message manually by id.
 * @param {number} id
 */
function removeMessage(id) {
  notificationStore.update(state => ({
    messages: state.messages.filter(m => m.id !== id)
  }));
}

/** Export convenience methods for each status */
export const notify = {
  success: (text, timeout) => addMessage({ status: 'success', text, timeout }),
  warning: (text, timeout) => addMessage({ status: 'warning', text, timeout }),
  error:   (text, timeout) => addMessage({ status: 'error', text, timeout }),
  info:    (text, timeout) => addMessage({ status: 'info', text, timeout }),
  remove: removeMessage
};
