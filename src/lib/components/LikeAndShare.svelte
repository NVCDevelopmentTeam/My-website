<script>
  import { onMount } from 'svelte';

  let likes = 0;
  let dialog;

  // Tăng số lượt thích và lưu vào localStorage
  const incrementLikes = () => {
    likes += 1;
    saveLikes();
  };

  const saveLikes = () => {
    const data = JSON.stringify({ likes });
    localStorage.setItem('likes', data);
  };

  // Mở hộp thoại chia sẻ
  const openDialog = () => {
    dialog.showModal();
    dialog.focus();
  };

  // Đóng hộp thoại chia sẻ
  const closeDialog = () => {
    dialog.close();
  };

  // Chia sẻ trên Facebook
  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    closeDialog();
  };

  // Chia sẻ trên Zalo
  const shareOnZalo = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://chat.zalo.me/share/url?url=${url}`, '_blank');
    closeDialog();
  };

  // Chia sẻ trên Twitter
  const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out this awesome content!');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    closeDialog();
  };

  // Chia sẻ trên LinkedIn
  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    closeDialog();
  };

  // Sao chép liên kết
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('Link copied to clipboard!'))
      .catch(err => console.error('Error copying link:', err));
    closeDialog();
  };

  // Khởi tạo số lượt thích từ localStorage khi tải trang
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
