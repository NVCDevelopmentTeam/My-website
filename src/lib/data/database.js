import { writable } from 'svelte/store';

// Initialize an empty array to act as your in-memory database
const initialData = [];

// Create a writable store to manage your database data
const database = writable(initialData);

// Export the database as the default export
export default database;
