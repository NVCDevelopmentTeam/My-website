<script>
import LatestPosts from "$lib/components/LatestPosts.svelte";
import SocialLinks from "$lib/components/SocialLinks.svelte";
</script>

<sidebar>
  <LatestPosts />
<SocialLinks />
</sidebar>

<style>
  sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 20%;
    padding: 24px;
    background-color: #f2f2f2;
    box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    margin-bottom: 24px;
  }

  a {
    display: block;
    text-decoration: none;
    font-weight: bold;
    color: #333;
    transition: all 0.3s ease;
  }

  a:hover {
    color: #000;
  }
</style>