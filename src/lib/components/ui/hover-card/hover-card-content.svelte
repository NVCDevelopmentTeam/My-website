<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<script>
	import { LinkPreview as HoverCardPrimitive } from "bits-ui";
	import { cn, flyAndScale } from "$lib/utils";

	type $$Props = HoverCardPrimitive.ContentProps;

	interface Props {
		class?: $$Props["class"];
		transition?: $$Props["transition"];
		transitionConfig?: $$Props["transitionConfig"];
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let {
		class: className = undefined,
		transition = flyAndScale,
		transitionConfig = undefined,
		children,
		...rest
	}: Props = $props();
	
</script>

<HoverCardPrimitive.Content
	{transition}
	{transitionConfig}
	class={cn(
		"z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none mt-3",
		className
	)}
	{...rest}
>
	{@render children?.()}
</HoverCardPrimitive.Content>
