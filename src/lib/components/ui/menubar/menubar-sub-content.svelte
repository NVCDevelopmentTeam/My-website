<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<script>
	import { Menubar as MenubarPrimitive } from "bits-ui";
	import { cn, flyAndScale } from "$lib/utils";

	type $$Props = MenubarPrimitive.SubContentProps;
	type $$Events = MenubarPrimitive.SubContentEvents;

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
		transitionConfig = { x: -10, y: 0 },
		children,
		...rest
	}: Props = $props();
	
</script>

<MenubarPrimitive.SubContent
	{transition}
	{transitionConfig}
	class={cn(
		"z-50 min-w-[9rem] rounded-md border bg-popover p-1 text-popover-foreground focus:outline-none",
		className
	)}
	{...rest}
	on:focusout
	on:pointermove
	on:keydown
>
	{@render children?.()}
</MenubarPrimitive.SubContent>
