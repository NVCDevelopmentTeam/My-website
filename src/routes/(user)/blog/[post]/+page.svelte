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

<div class="container mx-auto px-4 py-16">
	<article class="max-w-3xl mx-auto">
		{#if coverImage}
			<img
				class="w-full h-auto rounded-lg mb-8"
				src={coverImage}
				alt={title}
				width={coverWidth}
				height={coverHeight}
			/>
		{/if}
		<h1 class="text-4xl font-bold mb-4">{title}</h1>
		<div class="text-muted-foreground mb-8">
			{#if author}<p><b>Posted by:</b> {author}</p>{/if}
			{#if date}<p><b>Published:</b> {formatDate(date)}</p>{/if}
			{#if updated}<p><b>Updated:</b> {formatDate(updated)}</p>{/if}
		</div>
		{#if categories && categories.length > 0}
			<aside class="mb-8">
				<p class="font-medium mb-2">Posted in:</p>
				<ul class="flex flex-wrap gap-2">
					{#each categories as category (category)}
						<li>
							<a
								href={`/blog/category/${category}/`}
								class="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-1 rounded-md text-sm"
								>{category}</a
							>
						</li>
					{/each}
				</ul>
			</aside>
		{/if}

		<!-- Like and Share component -->
		<LikeAndShare />

		<!-- Pass title and post content to the TextToSpeech component -->
		<TextToSpeech {title} {postContent} />

		{#await import(`../../../../lib/posts/${data.meta.slug}.md`) then { default: PostContent } }
		<div class="prose dark:prose-invert max-w-none mt-8">
			{#if typeof PostContent === 'function'}
				<!-- Binding postElement and handling content rendering -->
				<div bind:this={postElement}>
					<PostContent />
				</div>
			{:else if typeof PostContent === 'string'}
				<!-- Handle HTML content safely -->
				<div bind:this={postElement}>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html PostContent}
				</div>
			{:else}
				<p>Error: Unable to display post content.</p>
			{/if}
		</div>
	{/await}

		{#if tags && tags.length > 0}
			<aside class="mt-8">
				<p class="font-medium mb-2">Tags:</p>
				<ul class="flex flex-wrap gap-2">
					{#each tags as tag (tag)}
						<li>
							<a
								href={`/blog/tag/{tag}/`}
								class="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-1 rounded-md text-sm"
								>{tag}</a
							>
						</li>
					{/each}
				</ul>
			</aside>
		{/if}
	</article>

	<!-- Comments section -->
	<div class="max-w-3xl mx-auto mt-16">
		<Comments />
	</div>
</div>
