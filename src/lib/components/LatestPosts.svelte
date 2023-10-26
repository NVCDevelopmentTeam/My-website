<script> 
import { onMount } from 'svelte'; 
import { fetch } from '@sveltejs/kit';
let posts = [];
onMount(async () => { const response = await fetch('/api/latest-posts'); 
posts = await response.json(); }); 
</script>
<div class=“latest-posts”> <h2>Latest posts</h2>
{#if posts.length > 0} {#each posts as post} <div class=“latest-post”> <p class=“latest-post-title”>{post.title}</p> </div> {/each} {:else} <p>No posts found.</p> {/if} </div>
<style>
  .latest-posts {
    /* add your styles for the .latest-posts container here */
  }
  
  .latest-posts h2 {
    /* add your styles for the .latest-posts heading here */
  }
  
  .latest-post {
    /* add your styles for each .latest-post div here */
  }
  
  .latest-post-title {
    /* add your styles for the .latest-post-title paragraph here */
  }
</style>