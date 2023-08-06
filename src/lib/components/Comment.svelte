<script>
  // Import any necessary dependencies
  import { onMount } from "svelte";
  import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/svelte";

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
    event.preventDefault();

    // Get the current date
    const date = new Date();

    // Set a default avatar image if none is provided
    const defaultAvatar = "https://via.placeholder.com/50x50?text=Avatar";

    // Add the comment to the comments array
    const newComment = {
      author,
      content,
      email,
      avatar: defaultAvatar,
      date,
      likes: 0,
      dislikes: 0,
      replies: [],
      pinned: false,
    };

    comments = [...comments, newComment];

    // Save the comments to a JSON file
    fetch("/save-comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comments),
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });

    // Reset the reactive variables
    email = "";
    author = "";
    content = "";
  }

  // Define any lifecycle hooks
  onMount(() => {
    // Do something when the component is mounted
    fetch("/load-comments")
      .then((response) => response.json())
      .then((data) => {
        comments = data;
      })
      .catch((error) => {
        console.error(error);
      });
  });

  // The following two functions have been slightly modified to return the results.
  function getPaginatedComments() {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return comments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }

  function getTotalPages() {
    return Math.ceil(comments.length / ITEMS_PER_PAGE);
  }

  // Create reactive variables to get paginated comments and total pages
  let paginatedComments;
  let totalPages;

  // Reactive statement to keep the paginated comments and total pages updated
  $: {
    paginatedComments = getPaginatedComments();
    totalPages = getTotalPages();
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
    {#if comments.length > 0}
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
                      <a on:click={() => handleReply(comment)}>Reply</a>
                    </MenuItem>
                    <MenuItem let:active>
                      <a on:click={() => handlePin(comment)}>Pin</a>
                    </MenuItem>
                    <MenuItem let:active>
                      <a on:click={() => handleReport(comment)}>Report</a>
                    </MenuItem>
                    <MenuItem let:active>
                      <a on:click={() => handleDelete(comment)}>Delete</a>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              {else}
                <a on:click={() => handleUnpin(comment)}>Unpin</a>
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
