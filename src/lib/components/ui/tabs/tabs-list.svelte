<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<script>
	import { Tabs as TabsPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";

	type $$Props = TabsPrimitive.ListProps;

	interface Props {
		class?: $$Props["class"];
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { class: className = undefined, children, ...rest }: Props = $props();
	
</script>

<TabsPrimitive.List
	class={cn(
		"inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
		className
	)}
	{...rest}
>
	{@render children?.()}
</TabsPrimitive.List>
