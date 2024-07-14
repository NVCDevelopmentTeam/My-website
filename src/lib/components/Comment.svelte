<script>
  import { onMount } from 'svelte';
  import { fetch as fetchComments } from '$lib/data/comment';

  let author = '';
  let content = '';
  let comments = [];

  const ITEMS_PER_PAGE = 5;
  let currentPage = 1;

  async function fetchCommentsData() {
    try {
      const response = await fetch('/api/comment.json');
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      comments = data.items; // Assuming comments are in the 'items' field
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const newComment = {
      author,
      content,
      date: new Date().toLocaleString(),
      likes: 0,
      dislikes: 0,
      replies: [],
      showReplies: false,
      pinned: false
    };

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
      comments = [data, ...comments];
      author = '';
      content = '';
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  }

  function getPaginatedComments() {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return comments.slice(start, end);
  }

  function getTotalPages() {
    return Math.ceil(comments.length / ITEMS_PER_PAGE);
  }

  $: paginatedComments = getPaginatedComments();
  $: totalPages = getTotalPages();

  function handleReply(comment) {
    // Handle reply to comment
  }

  function handlePin(comment) {
    comment.pinned = !comment.pinned;
  }

  function handleReport(comment) {
    // Handle report comment
  }

  function handleDelete(comment) {
    comments = comments.filter(c => c !== comment);
  }

  function handleLike(comment) {
    comment.likes += 1;
  }

  function handleDislike(comment) {
    comment.dislikes += 1;
  }

  onMount(async () => {
    await fetchCommentsData();
  });
</script>

<div class="comment">
  <form on:submit={handleSubmit}>
    <h2>Write a comment</h2>
    <label>
      Name:
      <input type="text" bind:value={author} required />
    </label>
    <label>
      Comment:
      <textarea bind:value={content} required></textarea>
    </label>
    <button type="submit">Submit</button>
  </form>

  {#if comments.length > 0}
    <h2>Comments:</h2>
    <p>
      <strong>Total Comments:</strong> {comments.length}
    </p>
    <!-- Pagination -->
    {#if totalPages > 1}
      <div class="pagination">
        {#each Array(totalPages) as _, i}
          <button
            class:selected={currentPage === i + 1}
            on:click={() => (currentPage = i + 1)}
          >
            {i + 1}
          </button>
        {/each}
      </div>
    {/if}

    <ul>
      {#each paginatedComments as comment}
        <li class="comment-item">
          <div class="comment-header">
            <p>{comment.author} - {comment.date}</p>
            <div class="menu-surface">
              <button>More</button>
              <div class="menu">
                <button on:click={() => handleReply(comment)}>Reply</button>
                <button on:click={() => handlePin(comment)}>Pin</button>
                <button on:click={() => handleReport(comment)}>Report</button>
                <button on:click={() => handleDelete(comment)}>Delete</button>
              </div>
            </div>
          </div>
          <div class="comment-content">
            <p>{comment.content}</p>
            <div class="comment-actions">
              <button on:click={() => handleLike(comment)}>Like</button>
              <span>{comment.likes}</span>
              <button on:click={() => handleDislike(comment)}>Dislike</button>
              <span>{comment.dislikes}</span>
              {#if comment.replies.length > 0}
                <button on:click={() => (comment.showReplies = !comment.showReplies)}>
                  {comment.showReplies ? 'Hide Replies' : 'Show Replies'} ({comment.replies.length})
                </button>
              {/if}
            </div>
          </div>
          {#if comment.replies.length > 0 && comment.showReplies}
            <ul>
              {#each comment.replies as reply}
                <li class="comment-item reply">
                  <div class="comment-header">
                    <p>{reply.author} - {reply.date}</p>
                  </div>
                  <div class="comment-content">
                    <p>{reply.content}</p>
                  </div>
                </li>
              {/each}
            </ul>
          {/if}
        </li>
      {/each}
    </ul>
  {:else}
    <p>No comments yet.</p>
  {/if}
</div>

<style>
  .comment {
    margin-top: 20px;
  }

  .comment h2 {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .comment-item {
    margin-bottom: 15px;
  }

  .comment-header {
    display: flex;
    justify-content: space-between;
  }

  .comment-content {
    margin-top: 5px;
  }

  .comment-actions {
    display: flex;
    gap: 10px;
    margin-top: 5px;
  }

  .reply {
    margin-left: 20px;
  }

  .pagination {
    display: flex;
    gap: 5px;
    margin-bottom: 10px;
  }

  .pagination button {
    padding: 5px 10px;
  }

  .pagination button.selected {
    font-weight: bold;
  }

  .menu-surface {
    position: relative;
    display: inline-block;
  }

  .menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background-color: white;
    border: 1px solid #ccc;
    padding: 5px;
  }

  .menu-surface:hover .menu {
    display: block;
  }
</style>
