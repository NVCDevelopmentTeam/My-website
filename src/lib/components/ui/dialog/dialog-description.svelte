<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<script>
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";

	type $$Props = DialogPrimitive.DescriptionProps;

	interface Props {
		class?: $$Props["class"];
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { class: className = undefined, children, ...rest }: Props = $props();
	
</script>

<DialogPrimitive.Description
	class={cn("text-sm text-muted-foreground", className)}
	{...rest}
>
	{@render children?.()}
</DialogPrimitive.Description>
