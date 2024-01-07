<script>
  // Import the necessary stores
  import { page } from '$app/stores'; // To determine the current page
  import { posts } from '$lib/data/fetchPosts'; // Replace with actual data

  // Get a list of recently posted articles (for example: 5 recent articles)
  let recentPosts = posts.slice(0, 5); // Change the number of posts as desired
</script>

<ul class="recent-posts">
  {#each recentPosts as post}
    <li>
      <a href={`/posts/${post.slug}`} class:selected={$page.url.pathname === `/posts/${post.slug}`}>
        {post.title}
      </a>
    </li>
  {/each}
</ul>

<style>
  /* CSS for post list */
  .recent-posts {
    list-style: none;
    padding: 0;
  }

  .recent-posts li {
    margin-bottom: 1rem;
  }

  .recent-posts a {
    text-decoration: none;
    color: #333;
    font-weight: bold;
  }

  .recent-posts a.selected {
    background-color: rgba(0, 0, 0, 0.1); /* Change background color when post is selected */
  }
</style>