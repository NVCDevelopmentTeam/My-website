// src/database.js
import { writable } from 'svelte/store';

// Initialize an empty array to act as your in-memory database
const initialData = [];

// Create a writable store to manage your database data
export const database = writable(initialData);
