import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Open or create a new SQLite database
export async function openDB() {
	return open({
		filename: './sources/saveDatabase.db',
		driver: sqlite3.Database
	});
}

// Create necessary tables if they don't exist
export async function createTables() {
	const db = await openDB();

	// Table to store visit statistics
	await db.exec(`CREATE TABLE IF NOT EXISTS visit_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visit_date TEXT,
    ip TEXT,
    country TEXT
  )`);

	// Table to store comments
	await db.exec(`CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    message TEXT,
    created_at TEXT
  )`);

	// Table to store contact information
	await db.exec(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    message TEXT,
    submitted_at TEXT
  )`);

	// Table to store chat history
	await db.exec(`CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    message TEXT,
    sent_at TEXT
  )`);
}

createTables();

// Function to log a new visit
export async function logVisit(ip, country) {
	const db = await openDB();
	const visitDate = new Date().toISOString();

	await db.run(
		`INSERT INTO visit_stats (visit_date, ip, country) VALUES (?, ?, ?)`,
		visitDate,
		ip,
		country
	);
}

// Function to retrieve visit statistics
export async function getVisitStats() {
	const db = await openDB();

	// Calculate today's date in ISO format
	const today = new Date().toISOString().split('T')[0];

	// Query total visits and visits today
	const totalVisits = await db.get(`SELECT COUNT(*) as count FROM visit_stats`);
	const visitsToday = await db.get(
		`SELECT COUNT(*) as count FROM visit_stats WHERE visit_date LIKE ?`,
		`${today}%`
	);
	const totalVisitors = await db.all(`SELECT DISTINCT ip FROM visit_stats`);
	const totalCountries = await db.all(`SELECT DISTINCT country FROM visit_stats`);

	return {
		visitsToday: visitsToday.count,
		totalVisits: totalVisits.count,
		totalVisitors: totalVisitors.length,
		totalCountries: totalCountries.length
	};
}

// Function to add a new comment
export async function addComment(name, message) {
	const db = await openDB();
	const createdAt = new Date().toISOString();

	await db.run(
		`INSERT INTO comments (name, message, created_at) VALUES (?, ?, ?)`,
		name,
		message,
		createdAt
	);
}

// Function to retrieve all comments
export async function getComments() {
	const db = await openDB();
	return await db.all(`SELECT * FROM comments`);
}

// Function to delete a comment by id
export async function deleteComment(id) {
	const db = await openDB();
	await db.run(`DELETE FROM comments WHERE id = ?`, id);
}

// Function to save contact information and clear data after submission
export async function saveContact(name, email, message) {
	const db = await openDB();
	const submittedAt = new Date().toISOString();

	await db.run(
		`INSERT INTO contacts (name, email, message, submitted_at) VALUES (?, ?, ?)`,
		name,
		email,
		message,
		submittedAt
	);

	// Delete all contact information to prevent data accumulation
	await db.run(`DELETE FROM contacts`);
}

// Function to save chat messages
export async function saveChatMessage(sessionId, message) {
	const db = await openDB();
	const sentAt = new Date().toISOString();

	await db.run(
		`INSERT INTO chat_history (session_id, message, sent_at) VALUES (?, ?, ?)`,
		sessionId,
		message,
		sentAt
	);
}

// Function to get chat history by session ID
export async function getChatHistory(sessionId) {
	const db = await openDB();
	return await db.all(
		`SELECT * FROM chat_history WHERE session_id = ? ORDER BY sent_at`,
		sessionId
	);
}

// Function to clear chat history after the conversation ends
export async function clearChatHistory(sessionId) {
	const db = await openDB();
	await db.run(`DELETE FROM chat_history WHERE session_id = ?`, sessionId);
}

export default {
	logVisit,
	getVisitStats,
	addComment,
	getComments,
	deleteComment,
	saveContact,
	saveChatMessage,
	getChatHistory,
	clearChatHistory
};
