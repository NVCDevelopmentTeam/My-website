<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<script>
	import { ContextMenu as ContextMenuPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";

	type $$Props = ContextMenuPrimitive.LabelProps & {
		inset?: boolean;
	};

	interface Props {
		class?: $$Props["class"];
		inset?: $$Props["inset"];
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { class: className = undefined, inset = undefined, children, ...rest }: Props = $props();
	
</script>

<ContextMenuPrimitive.Label
	class={cn(
		"px-2 py-1.5 text-sm font-semibold text-foreground",
		inset && "pl-8",
		className
	)}
	{...rest}
>
	{@render children?.()}
</ContextMenuPrimitive.Label>
