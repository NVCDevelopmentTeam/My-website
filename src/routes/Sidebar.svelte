<script>
import LatestPosts from '$lib/components/LatestPosts.svelte';
import SocialLinks from '$lib/components/SocialLinks.svelte';
</script>

<Sidebar>
  <LatestPosts />
  <SocialLinks />
</Sidebar>

<style>
.sidebar {
  background-color: #f5f5f5;
  padding: 1rem;
}
</style>
