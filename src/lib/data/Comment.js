import { json } from '@sveltejs/kit';

// GET /api/comments
export async function GET({ fetch }) {
  try {
    // Fetch comments from comment.json API
    const commentResponse = await fetch(`/api/comment.json`);
    if (!commentResponse.ok) throw new Error('Failed to fetch comments');

    const commentData = await commentResponse.json();

    // Fetch feed from feed.json API
    const feedResponse = await fetch(`/api/feed.json`);
    if (!feedResponse.ok) throw new Error('Failed to fetch feed');

    const feedData = await feedResponse.json();

    // Combine both data if necessary, assuming both return arrays of items
    const combinedData = [...commentData.items, ...feedData.items];

    return json(combinedData, { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

// POST /api/comments
export async function POST({ request }) {
  try {
    const comment = await request.json(); // Parse JSON từ request body
    const response = await fetch(`/api/comment.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(comment)
    });

    if (!response.ok) throw new Error('Failed to post comment');
    
    const data = await response.json();
    return json(data, { status: 201 });
  } catch (error) {
    console.error('Error posting comment:', error);
    return json({ error: 'Failed to post comment' }, { status: 500 });
  }
}

// DELETE /api/comments/:id
export async function DELETE({ params }) {
  try {
    const { id } = params;
    const response = await fetch(`/api/comment.json/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete comment');
    
    const data = await response.json();
    return json(data, { status: 200 });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
