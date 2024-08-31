<script>
  import { onMount } from 'svelte';

  let likes = 0;
  let dialog;

  // Increase the number of likes and save to localStorage
  const incrementLikes = () => {
    likes += 1;
    saveLikes();
  };

  const saveLikes = () => {
    const data = JSON.stringify({ likes });
    localStorage.setItem('likes', data);
  };

  // Open the sharing dialog box
  const openDialog = () => {
    dialog.showModal();
    dialog.focus();
  };

  // Close the sharing dialog
  const closeDialog = () => {
    dialog.close();
  };

  // Share on Facebook
  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    closeDialog();
  };

  // Share on Zalo
  const shareOnZalo = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://chat.zalo.me/share/url?url=${url}`, '_blank');
    closeDialog();
  };

  // Share on Twitter
  const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out this awesome content!');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    closeDialog();
  };

  // Share on LinkedIn
  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    closeDialog();
  };

  // Copy link
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('Link copied to clipboard!'))
      .catch(err => console.error('Error copying link:', err));
    closeDialog();
  };

  // Initialize likes from localStorage on page load
  onMount(() => {
    const data = localStorage.getItem('likes');
    if (data) {
      likes = JSON.parse(data).likes;
    }
  });
</script>

<div>
  <button on:click={incrementLikes}>Like</button>
  <p>{likes} Likes</p>
</div>

<div>
  <button on:click={openDialog}>Share</button>

  <dialog bind:this={dialog} aria-labelledby="dialog-title" aria-modal="true">
    <h2 id="dialog-title">Share this content</h2>
    <button on:click={closeDialog} aria-label="Close">X</button>
    <div>
      <button role="link" on:click={shareOnFacebook}>Share on Facebook</button>
      <button role="link" on:click={shareOnZalo}>Share on Zalo</button>
      <button role="link" on:click={shareOnTwitter}>Share on Twitter</button>
      <button role="link" on:click={shareOnLinkedIn}>Share on LinkedIn</button>
      <button role="link" on:click={copyLink}>Copy Link</button>
    </div>
  </dialog>
</div>