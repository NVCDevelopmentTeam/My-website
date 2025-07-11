import { getComments, addComment, deleteComment } from '$lib/data/database';

export async function GET() {
	try {
		// Fetch comments from the database
		const comments = await getComments();
		return new Response(JSON.stringify(comments), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch {
		// Handle errors during fetch
		return new Response(JSON.stringify({ error: 'Failed to fetch comments' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
}

export async function POST({ request }) {
	try {
		// Parse the incoming request JSON
		const comment = await request.json();

		// Add the new comment to the database
		await addComment(comment.name, comment.message);

		return new Response(JSON.stringify({ message: 'Comment added' }), {
			status: 201,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch {
		// Handle errors during comment addition
		return new Response(JSON.stringify({ error: 'Failed to add comment' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
}

export async function DELETE({ params }) {
	try {
		// Extract comment ID from the params
		const { id } = params;

		// Delete the comment with the specified ID
		await deleteComment(Number(id));

		return new Response(null, {
			status: 204
		});
	} catch {
		// Handle errors during comment deletion
		return new Response(JSON.stringify({ error: 'Failed to delete comment' }), {
			status: 500
		});
	}
}
