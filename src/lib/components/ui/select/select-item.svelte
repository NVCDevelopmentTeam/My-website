<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<script>
	import { Select as SelectPrimitive } from "bits-ui";
	import { Check } from "lucide-svelte";
	import { cn } from "$lib/utils";

	type $$Props = SelectPrimitive.ItemProps;
	type $$Events = SelectPrimitive.ItemEvents;

	interface Props {
		class?: $$Props["class"];
		value: $$Props["value"];
		label?: $$Props["label"];
		disabled?: $$Props["disabled"];
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let {
		class: className = undefined,
		value,
		label = undefined,
		disabled = undefined,
		children,
		...rest
	}: Props = $props();
	
</script>

<SelectPrimitive.Item
	{value}
	{disabled}
	{label}
	class={cn(
		"relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
		className
	)}
	{...rest}
	on:click
	on:keydown
	on:focusin
	on:focusout
	on:pointerleave
	on:pointermove
>
	<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
		<SelectPrimitive.ItemIndicator>
			<Check class="h-4 w-4" />
		</SelectPrimitive.ItemIndicator>
	</span>
	{@render children?.()}
</SelectPrimitive.Item>
