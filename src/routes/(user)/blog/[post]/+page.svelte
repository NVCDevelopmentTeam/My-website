<script>
	import { onMount } from 'svelte';
	import LikeAndShare from '$lib/components/LikeAndShare.svelte';
	import Comments from '$lib/components/Comments.svelte';
	import TextToSpeech from '$lib/components/TextToSpeech.svelte';
	import { formatDate } from '$lib/data/utils';

	let { data } = $props();

	// Destructure metadata
	const {
		title,
		preview,
		date,
		updated,
		author,
		categories,
		coverImage,
		coverWidth,
		coverHeight,
		tags
	} = data.meta;

	// Extract content and comments
	const { PostContent, comments } = data;

	// Reference to post content element
	let postElement = $state();
	let postContent = $state(''); // Initialize postContent to an empty string

	// Function to update plain text content from postElement
	function updatePlainTextContent() {
		if (postElement) {
			postContent = postElement.innerText || '';
		}
	}

	// Update content on mount
	onMount(() => {
		updatePlainTextContent();
	});

	// Ensure content is updated when postElement changes
	$effect(() => {
		if (postElement) {
			updatePlainTextContent();
		}
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={preview} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={title} />
	<meta name="twitter:title" content={title} />
	<meta property="og:description" content={preview} />
	<meta name="twitter:description" content={preview} />
	{#if coverImage}
		<meta property="og:image" content={coverImage} />
		<meta property="og:image:width" content={coverWidth} />
		<meta property="og:image:height" content={coverHeight} />
		<meta name="twitter:image" content={coverImage} />
	{/if}
</svelte:head>

<article class="post">
	{#if coverImage}
		<img class="cover-image" src={coverImage} alt={title} width={coverWidth} height={coverHeight} />
	{/if}
	<h1>{title}</h1>
	<div class="meta">
		{#if author}<b>Posted by:</b> {author}<br />{/if}
		{#if date}<b>Published:</b> {formatDate(date)}<br />{/if}
		{#if updated}<b>Updated:</b> {formatDate(updated)}{/if}
	</div>
	{#if categories && categories.length > 0}
		<aside class="post-header">
			<p>Posted in:</p>
			<ul class="post-header-categories">
				{#each categories as category}
					<li><a href={`/blog/category/${category}/`}>{category}</a></li>
				{/each}
			</ul>
		</aside>
	{/if}

	<!-- Like and Share component -->
	<LikeAndShare />

	<!-- Pass title and post content to the TextToSpeech component -->
	<TextToSpeech {title} {postContent} />

	{#if typeof PostContent === 'function'}
		<!-- Binding postElement and handling content rendering -->
		<div bind:this={postElement}>
			<PostContent />
		</div>
	{:else if typeof PostContent === 'string'}
		<!-- Handle HTML content safely -->
		<div bind:this={postElement}>
			{@html PostContent}
		</div>
	{:else}
		<p>Error: Unable to display post content.</p>
	{/if}

	{#if tags && tags.length > 0}
		<aside class="post-footer">
			<p>Tags:</p>
			<ul class="post-footer-tags">
				{#each tags as tag}
					<li><a href={`/blog/tag/{tag}/`}>{tag}</a></li>
				{/each}
			</ul>
		</aside>
	{/if}
</article>

<!-- Comments section -->
<Comments {comments} />
