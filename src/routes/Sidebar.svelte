<script>
  import search from '$lib/components/search.svelte';
  import accessibility from '$lib/components/accessibility.svelte';
  import latestPosts from '$lib/components/latestPosts.svelte';
  import socialLinks from '$lib/components/socialLinks.svelte';
import traffic from '$lib/components/traffic.svelte';
</script>

<sidebar class="sidebar">
  <div class="search-accessibility">
    <search />
    <accessibility />
  </div>
  <div class="latest-posts">
    <latestPosts />
  </div>
  <div class="social-links">
    <socialLinks />
  </div>
<traffic />
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
