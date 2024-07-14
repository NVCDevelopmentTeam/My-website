import database from '$lib/data/database';

export async function incrementVisitorCount() {
  try {
    database.incrementVisitorCount();
  } catch (error) {
    console.error('Error incrementing visitor count:', error);
    throw error;
  }
}

export async function getStats() {
  try {
    const stats = database.getStats();
    return { ...stats }; // Ensure it is a plain object
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
}
