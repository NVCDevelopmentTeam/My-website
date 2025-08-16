<script>
	let { data } = $props();
	const { uniqueCategories } = data;
</script>

<svelte:head>
	<title>Blog | Categories</title>
</svelte:head>

<div class="container mx-auto px-4 py-16">
	<div class="max-w-3xl mx-auto">
		<h1 class="text-4xl font-bold text-center mb-8">All blog categories</h1>

		<ul class="space-y-4">
			{#each uniqueCategories as category (category.title)}
				<li class="bg-card p-4 rounded-lg shadow flex justify-between items-center">
					<a
						href="/blog/category/{category.title}"
						class="text-lg font-medium text-primary hover:underline"
					>
						{category.title}
					</a>
					<span class="text-muted-foreground">({category.count})</span>
				</li>
			{/each}
		</ul>
	</div>
</div>
