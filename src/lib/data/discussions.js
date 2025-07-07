// Function to get all comments from the API
export async function fetchComments() {
	try {
		const response = await fetch('/api/comment.json');
		if (!response.ok) throw new Error('Failed to fetch comments');
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching comments:', error);
		throw new Error('Failed to fetch comments');
	}
}

// Function to add new comments to the API
export async function addComment(newComment) {
	try {
		const response = await fetch('/api/comment.json', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newComment)
		});
		if (!response.ok) throw new Error('Failed to post comment');
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error adding comment:', error);
		throw new Error('Failed to add comment');
	}
}

// Function to delete comments from API
export async function deleteComment(commentId) {
	try {
		const response = await fetch(`/api/comment.json/${commentId}`, {
			method: 'DELETE'
		});
		if (!response.ok) throw new Error('Failed to delete comment');
	} catch (error) {
		console.error('Error deleting comment:', error);
		throw new Error('Failed to delete comment');
	}
}

// Function to get data from API feed (if necessary)
export async function fetchFeed() {
	try {
		const response = await fetch('/api/feed.xml');
		if (!response.ok) throw new Error('Failed to fetch feed');
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching feed:', error);
		throw new Error('Failed to fetch feed');
	}
}
