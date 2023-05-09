<script>
  import {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
  } from "@rgossiaux/svelte-headlessui";
  // Import any necessary dependencies
  import { onMount } from "svelte";

  // Declare any reactive variables
  let email = "";
  let author = "";
  let content = "";
  let comments = [];

  // Pagination
  const ITEMS_PER_PAGE = 5;
  let currentPage = 1;
  let filteredComments = [];

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
    fetch('/save-comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(comments)
    })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.error(error);
      });

    // Reset the reactive variables
    email = "";
    author = "";
    content = "";
  }

  function handleLike(comment) {
    // Find the comment in the comments array and update its likes
    const updatedComments = comments.map((c) =>
      c === comment ? { ...c, likes: c.likes + 1 } : c
    );

    // Update the comments array
    comments = updatedComments;
  }

  function handleDislike(comment) {
    // Find the comment in the comments array and update its dislikes
    const updatedComments = comments.map((c) =>
      c === comment ? { ...c, dislikes: c.dislikes + 1 } : c
    );

    // Update the comments array
    comments = updatedComments;
  }

  function handlePin(comment) {
    // Find the comment in the comments array and update its pinned status
    const updatedComments = comments.map((c) =>
      c === comment ? { ...c, pinned: true } : c
    );

    // Update the comments array
    comments = updatedComments;
  }

  function handleUnpin(comment) {
    // Find the comment in the comments array and update its pinned status
    const updatedComments = comments.map((c) =>
      c === comment ? { ...c, pinned: false } : c
    );

    // Update the comments array
    comments = updatedComments;
  }

  function handleReport(comment) {
    // Find the comment in the comments array and remove it
    const filteredComments = comments.filter((c) => c !== comment);

    // Update the comments array
    comments = filteredComments;

    // Save the comments to a JSON file
    fetch('/save-comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(comments)
    })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.error(error);
      });
  }

  function handleDelete(comment) {
    // Filter out the comment from the comments array
    const filteredComments = comments.filter((c) => c !== comment);

    // Update the comments array
    comments = filteredComments;

    // Save the comments to a JSON file
    fetch('/save-comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(comments)
    })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.error(error);
      });
  }

  function handleReply(comment) {
    // Get the reply message from the user
    const reply = window.prompt("Enter your reply:");

    if (reply) {
      // Find the comment in the comments array and add the reply
      const updatedComments = comments.map((c) =>
        c === comment
          ? {
              ...c,
              replies: [
                ...c.replies,
                { author, content: reply, date: new Date() },
              ],
            }
          : c
      );

      // Update the comments array
      comments = updatedComments;

      // Save the comments to a JSON file
      fetch('/save-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(comments)
      })
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  function handlePageChange(page) {
    currentPage = page;
  }

  // Define any lifecycle hooks
  onMount(() => {
    // Do something when the component is mounted
    fetch('/load-comments')
      .then(response => response.json())
      .then(data => {
        comments = data;
        filteredComments = data;
      })
      .catch(error => {
        console.error(error);
      });
  });

  function getPaginatedComments() {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredComments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }

  const paginatedComments = getPaginatedComments();

  function getTotalPages() {
    return Math.ceil(filteredComments.length / ITEMS_PER_PAGE);
  }

  const totalPages = getTotalPages();
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

    {#if filteredComments.length > 0}
      <p>
        <strong>Comments:</strong> {filteredComments.length}
      </p>

      <!-- Pagination -->
      {#if totalPages > 1}
        <div class="pagination">
          {#each Array(totalPages) as _, i}
            <button
              class={currentPage === i + 1 ? "active" : ""}
              on:click={() => handlePageChange(i + 1)}
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
              <p>{comment.author} - {comment.date.toLocaleString()}</p>

              {#if !comment.pinned}
                <Menu>
                  <MenuButton>More</MenuButton>
                  <MenuItems>
                    <MenuItem let:active>
                      <button on:click={() => handleReply(comment)}>
                        Reply
                      </button>
                    </MenuItem>
                    <MenuItem let:active>
                      <button on:click={() => handlePin(comment)}>
                        Pin
                      </button>
                    </MenuItem>
                    <MenuItem let:active>
                      <button on:click={() => handleReport(comment)}>
                        Report
                      </button>
                    </MenuItem>
                    <MenuItem let:active>
                      <button on:click={() => handleDelete(comment)}>
                        Delete
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              {:else}
                <button on:click={() => handleUnpin(comment)}>
                  Unpin
                </button>
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
                      <p>{reply.author} - {reply.date.toLocaleString()}</p>
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
