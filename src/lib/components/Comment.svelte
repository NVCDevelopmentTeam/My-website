<script>
  // Import any necessary dependencies
  import { onMount } from "svelte";
  import { Divider, Text, Menu, MenuButton, MenuItems, MenuItem } from '@svelteuidev/core';

  // Declare any reactive variables
  let email = "";
  let author = "";
  let content = "";
  let comments = [];

  // Pagination
  const ITEMS_PER_PAGE = 5;
  let currentPage = 1;

  // Define any component methods
  function handleSubmit(event) {
    // ...
  }

  // Define any lifecycle hooks
  onMount(() => {
    // ...
  });

  // The following two functions have been slightly modified to return the results.
  function getPaginatedComments() {
    // ...
  }

  function getTotalPages() {
    // ...
  }

  // Create reactive variables to get paginated comments and total pages
  let paginatedComments;
  let totalPages;

  // Reactive statement to keep the paginated comments and total pages updated
  $: {
    paginatedComments = getPaginatedComments();
    totalPages = getTotalPages();
  }

  // Define event handlers for comment actions
  function handleReply(comment) {
    // ...
  }

  function handlePin(comment) {
    // ...
  }

  function handleReport(comment) {
    // ...
  }

  function handleDelete(comment) {
    // ...
  }

  function handleLike(comment) {
    // ...
  }

  function handleDislike(comment) {
    // ...
  }
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
      <textarea bind:value={content} required />
    </label>
    <button type="submit">Submit</button>
  </form>

  {#if comments.length > 0}
    <h2>Comments:</h2>
    <p>
      <strong>Comments:</strong> {comments.length}
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
              <Menu>
                <MenuButton>More</MenuButton>
                <MenuItems>
                  <MenuItem let:active>
                    <button on:click={() => handleReply(comment)}>Reply</button>
                  </MenuItem>
                  <MenuItem let:active>
                    <button on:click={() => handlePin(comment)}>Pin</button>
                  </MenuItem>
                  <MenuItem let:active>
                    <button on:click={() => handleReport(comment)}>Report</button>
                  </MenuItem>
                  <MenuItem let:active>
                    <button on:click={() => handleDelete(comment)}>Delete</button>
                  </MenuItem>
                </MenuItems>
              </Menu>
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
  /* Global styles */
  body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    padding: 20px;
  }

  /* Comment section styles */
  .comment {
    margin-top: 20px;
  }

  .comment h2 {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .comment form {
    margin-bottom: 20px;
  }

  .comment label {
    display: block;
    margin-bottom: 10px;
  }

  .comment input[type="text"],
  .comment textarea {
    width: 100%;
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .comment button {
    background-color: #007bff;
    color: #fff;
    padding: 8px 15px;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .comment button:hover {
    background-color: #0056b3;
  }

  /* Comment list styles */
  .comment ul {
    list-style: none;
    padding: 0;
  }

  .comment-item {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .comment-item.reply {
    margin-top: 10px;
    margin-left: 20px;
    border-color: #ddd;
  }

  .comment-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .comment-actions {
    margin-top: 10px;
  }

  .comment-actions button {
    background-color: #007bff;
    color: #fff;
    padding: 5px 10px;
    font-size: 14px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 5px;
  }

  .comment-actions span {
    margin-left: 5px;
  }

  /* Pagination styles */
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .pagination button {
    background-color: #007bff;
    color: #fff;
    padding: 5px 10px;
    font-size: 14px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 5px;
  }

  .pagination button.active {
    background-color: #0056b3;
  }
</style>