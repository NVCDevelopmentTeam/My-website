<!-- @migration-task Error while migrating Svelte code: The keyword 'interface' is reserved -->
<!-- @migration-task Error while migrating Svelte code: The keyword 'interface' is reserved -->
<script>
	import * as Button from "$lib/components/ui/button";
	interface Props {
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { children, ...rest }: Props = $props();
	type $$Props = Button.Props;
	type $$Events = Button.Events;
</script>

<Button.Root type="submit" {...rest} on:click on:keydown>
	{@render children?.()}
</Button.Root>
