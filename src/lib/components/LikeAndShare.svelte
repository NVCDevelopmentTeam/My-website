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

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out this awesome content!');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
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
  <a href="#" class="share-link" on:click|preventDefault={shareOnFacebook}>Share on Facebook</a>
  <a href="#" class="share-link" on:click|preventDefault={shareOnTwitter}>Share on Twitter</a>
  <a href="#" class="share-link" on:click|preventDefault={shareOnLinkedIn}>Share on LinkedIn</a>
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

  .share-link {
    display: block;
    background-color: #008CBA;
    color: white;
    text-align: center;
    padding: 10px;
    margin: 4px 2px;
    text-decoration: none;
    border-radius: 4px;
  }

  .share-link:hover {
    background-color: #007B9A;
  }
</style>
