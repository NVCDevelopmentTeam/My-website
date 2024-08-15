<script>
  import LatestPosts from '$lib/components/LatestPosts.svelte';
  import SocialLinks from '$lib/components/SocialLinks.svelte';
import Newsletter  from '$lib/components/Newsletter.svelte';
import VisitorStatistics from '$lib/components/VisitorStatistics.svelte';
</script>

<sidebar class="sidebar">
  <div class="latest-posts">
    <LatestPosts />
  </div>
  <div class="social-links">
<Newsletter />
    <SocialLinks />
<VisitorStatistics />
  </div>

</sidebar>
