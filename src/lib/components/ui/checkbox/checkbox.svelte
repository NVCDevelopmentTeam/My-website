<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<script>
	import { Checkbox as CheckboxPrimitive } from "bits-ui";
	import { Check, Minus } from "lucide-svelte";
	import { cn } from "$lib/utils";

	type $$Props = CheckboxPrimitive.Props;
	type $$Events = CheckboxPrimitive.Events;

	interface Props {
		class?: $$Props["class"];
		checked?: $$Props["checked"];
		[key: string]: any
	}

	let { class: className = undefined, checked = $bindable(false), ...rest }: Props = $props();
	
</script>

<CheckboxPrimitive.Root
	class={cn(
		"box-content peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
		className
	)}
	bind:checked
	{...rest}
	on:click
>
	<CheckboxPrimitive.Indicator
		class={cn("flex items-center justify-center text-current h-4 w-4")}
		
		
	>
		{#snippet children({ isChecked, isIndeterminate })}
				{#if isChecked}
				<Check class="h-3.5 w-3.5" />
			{:else if isIndeterminate}
				<Minus class="h-3.5 w-3.5" />
			{/if}
					{/snippet}
		</CheckboxPrimitive.Indicator>
</CheckboxPrimitive.Root>
