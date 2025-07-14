<script>
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
</script>

<div class="min-h-screen bg-background text-foreground flex flex-col">
	{@render children?.()}
</div>
