// comment.js

// GET /api/comments
export function getComments() {
  // Fetch comments from the server
  // Example code - replace with your own implementation
  return fetch('/api/comments')
    .then(response => response.json())
    .then(data => data.comments);
}

// POST /api/comments
export function createComment(comment) {
  // Send the new comment to the server
  // Example code - replace with your own implementation
  return fetch('/api/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(comment)
  })
    .then(response => response.json())
    .then(data => data.comment);
}

// DELETE /api/comments/:id
export function deleteComment(id) {
  // Delete the comment from the server
  // Example code - replace with your own implementation
  return fetch(`/api/comments/${id}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => data.deleted);
}
