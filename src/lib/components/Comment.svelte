<script>
  import { onMount } from 'svelte';
  import { fetchComments, addComment, deleteComment } from '$lib/data/comment';

  export let comments = [];

  let author = '';
  let content = '';

  const ITEMS_PER_PAGE = 5;
  let currentPage = 1;

  async function fetchCommentsData() {
    try {
      const data = await fetchComments();
      comments = data;
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const newComment = {
      id: Date.now().toString(),
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
      const data = await addComment(newComment);
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

  async function handleDelete(comment) {
    try {
      await deleteComment(comment.id);
      comments = comments.filter(c => c.id !== comment.id);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
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
              <button type="button">More</button>
              <div class="menu">
                <button type="button" on:click={() => handleReply(comment)}>Reply</button>
                <button type="button" on:click={() => handlePin(comment)}>Pin</button>
                <button type="button" on:click={() => handleReport(comment)}>Report</button>
                <button type="button" on:click={() => handleDelete(comment)}>Delete</button>
              </div>
            </div>
          </div>
          <div class="comment-content">
            <p>{comment.content}</p>
            <div class="comment-actions">
              <button type="button" on:click={() => handleLike(comment)}>Like</button>
              <span>{comment.likes}</span>
              <button type="button" on:click={() => handleDislike(comment)}>Dislike</button>
              <span>{comment.dislikes}</span>
              {#if comment.replies.length > 0}
                <button type="button" on:click={() => (comment.showReplies = !comment.showReplies)}>
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
    <p>0 comments</p>
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
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
  }

  .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .comment-header p {
    margin: 0;
  }

  .comment-content {
    margin-top: 10px;
  }

  .comment-actions {
    display: flex;
    gap: 10px;
    margin-top: 5px;
  }

  .reply {
    margin-left: 20px;
    border: 1px solid #ddd;
    padding: 5px;
    border-radius: 5px;
  }

  .pagination {
    display: flex;
    gap: 5px;
    margin-bottom: 10px;
    justify-content: center;
  }

  .pagination button {
    padding: 5px 10px;
    border: 1px solid #ccc;
    background-color: #f5f5f5;
    cursor: pointer;
  }

  .pagination button.selected {
    font-weight: bold;
    background-color: #ddd;
  }

  .menu-surface {
    position: relative;
    display: inline-block;
  }

  .menu {
    display: none;
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    border: 1px solid #ccc;
    padding: 5px;
    z-index: 1;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .menu-surface:hover .menu {
    display: block;
  }

  .menu button {
    display: block;
    width: 100%;
    padding: 5px;
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
  }

  .menu button:hover {
    background-color: #f5f5f5;
  }
</style>
