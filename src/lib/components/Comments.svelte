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

<div class="container mx-auto px-4 py-8">
	<form onsubmit={handleSubmit} class="mb-8 p-6 bg-card rounded-lg shadow-md">
		<h2 class="text-2xl font-bold mb-4">Write a comment</h2>
		<input
			type="text"
			bind:value={$author}
			placeholder="Your name"
			required
			class="w-full px-4 py-2 border rounded-md bg-input text-foreground focus:ring-primary focus:border-primary mb-4"
		/>
		<textarea
			bind:value={$content}
			placeholder="Write your comment..."
			required
			class="w-full px-4 py-2 border rounded-md bg-input text-foreground focus:ring-primary focus:border-primary mb-4 h-32"
		></textarea>
		<button
			type="submit"
			class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
			>Submit</button
		>
	</form>

	{#if $comments.length > 0}
		<h2 class="text-2xl font-bold mb-4">Comments:</h2>
		<ul class="space-y-4">
			{#each $paginatedComments as comment (comment.id)}
				<li class="bg-card p-4 rounded-lg shadow">
					<p class="text-sm text-muted-foreground mb-1">
						<strong>{comment.author}</strong> - {comment.date}
					</p>
					<p class="text-foreground mb-2">{comment.content}</p>
					<div class="flex space-x-2">
						<button
							onclick={() => handleReply(comment)}
							class="text-primary hover:underline text-sm">Reply</button
						>
						<button
							onclick={() => handleDelete(comment.id)}
							class="text-destructive hover:underline text-sm">Delete</button
						>
					</div>

					{#if comment.replies.length > 0}
						<ul class="space-y-4">
							{#each comment.replies as reply (reply.id)}
								<li class="ml-4 p-3 bg-secondary rounded-lg shadow-sm">
									<p class="text-sm text-muted-foreground mb-1">
										<strong>{reply.author}</strong> - {reply.date}
									</p>
									<p class="text-foreground">{reply.content}</p>
								</li>
							{/each}
						</ul>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</div>
