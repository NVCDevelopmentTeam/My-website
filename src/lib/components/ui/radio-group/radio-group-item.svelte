<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<script>
	import { RadioGroup as RadioGroupPrimitive } from "bits-ui";
	import { Circle } from "lucide-svelte";
	import { cn } from "$lib/utils";

	type $$Props = RadioGroupPrimitive.ItemProps;
	type $$Events = RadioGroupPrimitive.ItemEvents;

	interface Props {
		class?: $$Props["class"];
		value: $$Props["value"];
		[key: string]: any
	}

	let { class: className = undefined, value, ...rest }: Props = $props();
	
</script>

<RadioGroupPrimitive.Item
	{value}
	class={cn(
		"aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
	{...rest}
	on:click
>
	<div class="flex items-center justify-center">
		<RadioGroupPrimitive.ItemIndicator>
			<Circle class="h-2.5 w-2.5 fill-current text-current" />
		</RadioGroupPrimitive.ItemIndicator>
	</div>
</RadioGroupPrimitive.Item>
