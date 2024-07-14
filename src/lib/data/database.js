let stats = {
  visitsToday: 0,
  totalVisits: 0,
  totalVisitors: 0,
  totalCountries: 0
};

let comments = [];

function incrementVisitorCount() {
  stats.visitsToday++;
  stats.totalVisits++;
  stats.totalVisitors++; // Adjust this logic as needed
}

function getStats() {
  return { ...stats }; // Ensure it is a plain object
}

function updateStats(newStats) {
  stats = { ...stats, ...newStats };
}

function getComments() {
  return [...comments];
}

function addComment(newComment) {
  comments.push(newComment);
}

function deleteComment(commentId) {
  comments = comments.filter(comment => comment.id !== commentId);
}

function updateComment(commentId, updatedData) {
  const commentIndex = comments.findIndex(comment => comment.id === commentId);
  if (commentIndex !== -1) {
    comments[commentIndex] = { ...comments[commentIndex], ...updatedData };
  }
}

export default {
  incrementVisitorCount,
  getStats,
  updateStats,
  getComments,
  addComment,
  deleteComment,
  updateComment
};
