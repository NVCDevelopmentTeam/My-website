<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<script>
	import { Accordion as AccordionPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";

	type $$Props = AccordionPrimitive.ItemProps;

	interface Props {
		class?: $$Props["class"];
		value: $$Props["value"];
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { class: className = undefined, value, children, ...rest }: Props = $props();
	
</script>

<AccordionPrimitive.Item
	{value}
	class={cn("border-b", className)}
	{...rest}
>
	{@render children?.()}
</AccordionPrimitive.Item>
