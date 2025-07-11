<script>
	import { onMount } from 'svelte';
	import { fetchComments, addComment, deleteComment } from '$lib/data/discussions';
	import { writable, derived, get } from 'svelte/store';

	let comments = writable([]);
	let author = writable('');
	let content = writable('');
	let replyingTo = writable(null);

	let currentPage = writable(1);

	const ITEMS_PER_PAGE = 5;

	async function fetchCommentsData() {
		try {
			const data = await fetchComments();
			comments.set(data);
		} catch (error) {
			console.error('Error fetching comments:', error);
		}
	}

	async function handleSubmit(event) {
		event.preventDefault();
		if (!get(content).trim() || !get(author).trim()) return;

		let newComment = {
			id: Date.now().toString(),
			author: get(author),
			content: get(content),
			date: new Date().toLocaleString(),
			replies: []
		};

		try {
			const data = await addComment(newComment);
			comments.update((c) => [...c, data]);
			author.set('');
			content.set('');
		} catch (error) {
			console.error('Error posting comment:', error);
		}
	}

	async function handleDelete(commentId) {
		if (!confirm('Are you sure you want to delete this comment?')) return;
		try {
			await deleteComment(commentId);
			comments.update((c) => c.filter((comment) => comment.id !== commentId));
		} catch (error) {
			console.error('Error deleting comment:', error);
		}
	}

	function handleReply(comment) {
		replyingTo.set(comment);
	}

	const paginatedComments = derived([comments, currentPage], ([$comments, $currentPage]) => {
		const start = ($currentPage - 1) * ITEMS_PER_PAGE;
		return $comments.slice(start, start + ITEMS_PER_PAGE);
	});

	onMount(fetchCommentsData);
</script>

<div>
	<form onsubmit={handleSubmit}>
		<h2>Write a comment</h2>
		<input type="text" bind:value={$author} placeholder="Your name" required />
		<textarea bind:value={$content} placeholder="Write your comment..." required></textarea>
		<button type="submit">Submit</button>
	</form>

	{#if $comments.length > 0}
		<h2>Comments:</h2>
		<ul>
			{#each $paginatedComments as comment (comment.id)}
				<li>
					<p><strong>{comment.author}</strong> - {comment.date}</p>
					<p>{comment.content}</p>
					<button onclick={() => handleReply(comment)}>Reply</button>
					<button onclick={() => handleDelete(comment.id)}>Delete</button>

					{#if comment.replies.length > 0}
						<ul>
							{#each comment.replies as reply (reply.id)}
								<li>
									<p><strong>{reply.author}</strong> - {reply.date}</p>
									<p>{reply.content}</p>
								</li>
							{/each}
						</ul>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</div>
