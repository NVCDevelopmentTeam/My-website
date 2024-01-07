<script context="module">
  // Import the necessary stores
  import { page } from '$app/stores'; // To determine the current page
  import { fetchPosts } from '$lib/data/fetchPosts'; // Replace with actual data

  // Fetch the posts data
  export let recentPosts;

  // Fetch the posts data when the module is instantiated
  export async function load({ fetch }) {
    recentPosts = await fetchPosts();
  }
  // Get a list of recently posted articles (for example: 5 recent articles)
  let postsToShow = recentPosts?.slice(0, 5) ?? [];
</script>

<ul class="recent-posts">
  {#each postsToShow as post}
    <li>
      <a href={`/posts/${post.slug}`} class:selected={page.url.pathname === `/posts/${post.slug}` ? 'selected' : ''}>
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
    display: block; /* Added to make the whole area clickable */
    padding: 0.5rem; /* Added for better clickability */
  }

  .recent-posts a.selected {
    background-color: rgba(0, 0, 0, 0.1); /* Change background color when post is selected */
  }
</style>