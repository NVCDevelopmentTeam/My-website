<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<script>
	import { Dialog as SheetPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";

	type $$Props = SheetPrimitive.PortalProps;

	interface Props {
		class?: $$Props["class"];
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { class: className = undefined, children, ...rest }: Props = $props();
	
</script>

<SheetPrimitive.Portal class={cn(className)} {...rest}>
	{@render children?.()}
</SheetPrimitive.Portal>
