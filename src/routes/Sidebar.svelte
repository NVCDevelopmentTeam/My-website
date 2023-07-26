<script>
  import LatestPosts from '$lib/components/LatestPosts.svelte';
  import SocialLinks from '$lib/components/SocialLinks.svelte';
</script>

<sidebar class="sidebar">
  <div class="latest-posts">
    <LatestPosts />
  </div>
  <div class="social-links">
    <SocialLinks />
  </div>
</sidebar>

<style>
  /* Add your additional CSS styles here */
  .sidebar {
    padding: 1rem;
    background-color: #f5f5f5;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  /* Add any specific styles for the LatestPosts and SocialLinks components */
  .latest-posts {
    margin-bottom: 1rem;
  }

  .social-links {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
