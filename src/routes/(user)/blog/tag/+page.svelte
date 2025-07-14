<script>
	let { data } = $props();
	const { uniqueTags } = data;
</script>

<svelte:head>
	<title>Blog | tags</title>
</svelte:head>

<div class="container mx-auto px-4 py-16">
	<div class="max-w-3xl mx-auto">
		<h1 class="text-4xl font-bold text-center mb-8">All blog tags</h1>

		<ul class="space-y-4">
			{#each uniqueTags as tag (tag.title)}
				<li class="bg-card p-4 rounded-lg shadow flex justify-between items-center">
					<a href="/blog/tag/{tag.title}" class="text-lg font-medium text-primary hover:underline">
						{tag.title}
					</a>
					<span class="text-muted-foreground">({tag.count})</span>
				</li>
			{/each}
		</ul>
	</div>
</div>
