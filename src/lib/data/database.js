import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function openDB() {
  return open({
    filename: './subscribers.db',
    driver: sqlite3.Database
  });
}

export async function createTable() {
  const db = await openDB();
  await db.exec(`CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    subscribed_at TEXT,
    unsubscribe_token TEXT
  )`);
}

export async function unsubscribe(email) {
  const db = await openDB();
  await db.run('DELETE FROM subscribers WHERE email = ?', email);
}

createTable();
const database = {
  // Statistical data
  stats: {
    visitsToday: 0,
    totalVisits: 0,
    totalVisitors: new Set(),
    totalCountries: new Set()
  },
  
  // Comment data
  comments: [],

  // Get visit statistics
  getStats() {
    return {
      visitsToday: this.stats.visitsToday,
      totalVisits: this.stats.totalVisits,
      totalVisitors: this.stats.totalVisitors.size,
      totalCountries: this.stats.totalCountries.size
    };
  },

  // Update visit statistics
  updateStats(newVisit) {
    const { ip, country } = newVisit;

    // Update statistics
    this.stats.visitsToday += 1;
    this.stats.totalVisits += 1;
    this.stats.totalVisitors.add(ip);
    this.stats.totalCountries.add(country);
  },

  // Get all comments
  getComments() {
    return this.comments;
  },

  // Add new comment
  addComment(comment) {
    const newComment = { id: this.comments.length + 1, ...comment };
    this.comments.push(newComment);
    return newComment;
  },

  // Delete comments
  deleteComment(id) {
    this.comments = this.comments.filter(comment => comment.id !== id);
  }
};

export default database;