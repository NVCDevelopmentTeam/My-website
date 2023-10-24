<script> 
import { onMount } from 'svelte'; 
import { fetch } from '@sveltejs/kit';
let posts = [];
onMount(async () => { const response = await fetch('/api/latest-posts'); 
posts = await response.json(); }); 
</script>
<div class=“latest-posts”> <h2>Latest posts</h2>
{#if posts.length > 0} {#each posts as post} <div class=“latest-post”> <p class=“latest-post-title”>{post.title}</p> </div> {/each} {:else} <p>No posts found.</p> {/if} </div>
<style> .latest-posts { display: flex; flex-direction: column; align-items: flex-start; }
.latest-post { margin-bottom: 10px; }
.latest-post-title { font-size: 16px; font-weight: bold; } </style>