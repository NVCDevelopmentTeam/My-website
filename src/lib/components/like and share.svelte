<script>
  import { onMount } from 'svelte';

  let likes = 0;

  const incrementLikes = () => {
    likes += 1;
    saveLikes();
  };

  const saveLikes = () => {
    const data = JSON.stringify({ likes });
    localStorage.setItem('likes', data);
  };

  const shareContent = () => {
    // Code to share content goes here
  };

  onMount(() => {
    const data = localStorage.getItem('likes');
    if (data) {
      likes = JSON.parse(data).likes;
    }
  });
</script>

<div>
  <button class="like-button" on:click={incrementLikes}>Like</button>
  <p>{likes} Likes</p>
</div>

<div>
  <button class="share-button" on:click={shareContent}>Share</button>
</div>

<style>
  button {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
  }

  .like-button {
    background-color: #4CAF50;
  }

  .share-button {
    background-color: #008CBA;
  }
</style>
