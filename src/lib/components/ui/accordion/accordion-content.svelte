<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<script>
	import { Accordion as AccordionPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";
	import { slide } from "svelte/transition";

	type $$Props = AccordionPrimitive.ContentProps;

	interface Props {
		class?: $$Props["class"];
		transition?: $$Props["transition"];
		transitionConfig?: $$Props["transitionConfig"];
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let {
		class: className = undefined,
		transition = slide,
		transitionConfig = {
		duration: 200
	},
		children,
		...rest
	}: Props = $props();
	
</script>

<AccordionPrimitive.Content
	class={cn("overflow-hidden text-sm transition-all", className)}
	{transition}
	{transitionConfig}
	{...rest}
>
	<div class="pb-4 pt-0">
		{@render children?.()}
	</div>
</AccordionPrimitive.Content>
