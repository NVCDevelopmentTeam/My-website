<script>
  import { onMount } from "svelte";
  import { Button } from '@smui/button';
  import { Menu, MenuItem, MenuSurface } from '@smui/menu';

  let author = "";
  let content = "";
  let comments = [];

  const ITEMS_PER_PAGE = 5;
  let currentPage = 1;

  async function fetchComments() {
    // Placeholder for fetching comments from a backend service
    return [
      // Add sample comment objects here if needed
    ];
  }

  function handleSubmit(event) {
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
    comments = [newComment, ...comments];
    author = "";
    content = "";
  }

  function getPaginatedComments() {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return comments.slice(start, end);
  }

  function getTotalPages() {
    return Math.ceil(comments.length / ITEMS_PER_PAGE);
  }

  let paginatedComments;
  let totalPages;

  $: {
    paginatedComments = getPaginatedComments();
    totalPages = getTotalPages();
  }

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
    comments = await fetchComments();
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
            {#if !comment.pinned}
              <MenuSurface>
                <Button slot="anchor" variant="outlined">More</Button>
                <Menu>
                  <MenuItem on:click={() => handleReply(comment)}>Reply</MenuItem>
                  <MenuItem on:click={() => handlePin(comment)}>Pin</MenuItem>
                  <MenuItem on:click={() => handleReport(comment)}>Report</MenuItem>
                  <MenuItem on:click={() => handleDelete(comment)}>Delete</MenuItem>
                </Menu>
              </MenuSurface>
            {/if}
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
                  {comment.showReplies ? "Hide Replies" : "Show Replies"} ({comment.replies.length})
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
</style>
