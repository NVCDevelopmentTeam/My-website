<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<script>
	import { Slider as SliderPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";

	type $$Props = SliderPrimitive.Props;

	interface Props {
		class?: $$Props["class"];
		value?: $$Props["value"];
		[key: string]: any
	}

	let { class: className = undefined, value = $bindable([0]), ...rest }: Props = $props();
	
</script>

<SliderPrimitive.Root
	bind:value
	class={cn(
		"relative flex w-full touch-none select-none items-center",
		className
	)}
	{...rest}
>
	<span
		class="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary"
	>
		<SliderPrimitive.Range class="absolute h-full bg-primary" />
	</span>
	<SliderPrimitive.Thumb
		class="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
	/>
</SliderPrimitive.Root>
