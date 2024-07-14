import database from '$lib/data/database';
import { json } from '@sveltejs/kit';

// GET /api/comment.json
export async function GET() {
  const comments = database.getComments();
  return new Response(JSON.stringify({ items: comments }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

// POST /api/comment.json
export async function POST({ request }) {
  try {
    const comment = await request.json();
    database.addComment(comment);
    return new Response(JSON.stringify(comment), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return new Response(JSON.stringify({ error: 'Failed to add comment' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// DELETE /api/comment.json/:id
export async function DELETE({ params }) {
  try {
    const { id } = params;
    database.deleteComment(id);
    return new Response(JSON.stringify({ id }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete comment' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
