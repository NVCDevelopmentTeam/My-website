<script>

// add api 	// This component should fetch latest posts from an API
	// For now, we'll use static data
	const posts = [
		{ id: 1, title: 'Getting Started with SvelteKit', slug: 'getting-started-with-sveltekit' },
		{ id: 2, title: 'Accessibility Best Practices', slug: 'accessibility-best-practices' },
		{ id: 3, title: 'Understanding TailwindCSS', slug: 'understanding-tailwindcss' }
	];
</script>

<div class="bg-gray-100 p-4 rounded-lg">
	<h3 class="font-bold text-lg mb-4">Latest Posts</h3>
	<ul>
		{#each posts as post}
			<li class="mb-2">
				<a href="/blog/{post.slug}" class="text-primary hover:underline">{post.title}</a>
			</li>
		{/each}
	</ul>
</div>
