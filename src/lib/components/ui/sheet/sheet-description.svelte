<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<script>
	import { Dialog as SheetPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";

	type $$Props = SheetPrimitive.DescriptionProps;

	interface Props {
		class?: $$Props["class"];
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { class: className = undefined, children, ...rest }: Props = $props();
	
</script>

<SheetPrimitive.Description
	class={cn("text-sm text-muted-foreground", className)}
	{...rest}
>
	{@render children?.()}
</SheetPrimitive.Description>
