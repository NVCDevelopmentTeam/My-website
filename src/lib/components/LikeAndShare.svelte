<script>
	import { onMount } from 'svelte';

	let likes = $state(0);
	let dialog = $state();

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
		navigator.clipboard
			.writeText(window.location.href)
			.then(() => alert('Link copied to clipboard!'))
			.catch((err) => console.error('Error copying link:', err));
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

<div class="flex items-center space-x-4">
	<button
		onclick={incrementLikes}
		class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
		>Like</button
	>
	<p class="text-lg text-foreground">{likes} Likes</p>
</div>

<div class="mt-4">
	<button
		onclick={openDialog}
		class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
		>Share</button
	>

	<dialog
		bind:this={dialog}
		aria-labelledby="dialog-title"
		aria-modal="true"
		class="p-6 rounded-lg shadow-lg backdrop:bg-black/50"
	>
		<h2 id="dialog-title" class="text-xl font-bold mb-4">Share this content</h2>
		<button
			onclick={closeDialog}
			aria-label="Close"
			class="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200">X</button
		>
		<div class="grid grid-cols-2 gap-4">
			<button
				role="link"
				onclick={shareOnFacebook}
				class="px-4 py-2 rounded-md text-white font-semibold transition-colors bg-blue-600 hover:bg-blue-700"
				>Share on Facebook</button
			>
			<button
				role="link"
				onclick={shareOnZalo}
				class="px-4 py-2 rounded-md text-white font-semibold transition-colors bg-blue-400 hover:bg-blue-500"
				>Share on Zalo</button
			>
			<button
				role="link"
				onclick={shareOnTwitter}
				class="px-4 py-2 rounded-md text-white font-semibold transition-colors bg-blue-400 hover:bg-blue-500"
				>Share on Twitter</button
			>
			<button
				role="link"
				onclick={shareOnLinkedIn}
				class="px-4 py-2 rounded-md text-white font-semibold transition-colors bg-blue-700 hover:bg-blue-800"
				>Share on LinkedIn</button
			>
			<button
				role="link"
				onclick={copyLink}
				class="px-4 py-2 rounded-md text-white font-semibold transition-colors bg-gray-500 hover:bg-gray-600"
				>Copy Link</button
			>
		</div>
	</dialog>
</div>
