// comment.js
import { json } from '@sveltejs/kit';

// GET /api/comments
export async function get(request) {
  try {
    const response = await fetch('/api/comments');
    const data = await response.json();
    return json(data.comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return json({ error: 'Failed to fetch comments' }, 500);
  }
}

// POST /api/comments
export async function post(request) {
  try {
    const comment = request.body;
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(comment)
    });
    const data = await response.json();
    return json(data.comment);
  } catch (error) {
    console.error('Error posting comment:', error);
    return json({ error: 'Failed to post comment' }, 500);
  }
}

// DELETE /api/comments/:id
export async function del(request) {
  try {
    const { id } = request.params;
    const response = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
    const data = await response.json();
    return json(data.deleted);
  } catch (error) {
    console.error('Error deleting comment:', error);
    return json({ error: 'Failed to delete comment' }, 500);
  }
}
