<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<script>
	import * as Select from "$lib/components/ui/select";
	import type { Select as SelectPrimitive } from "bits-ui";
	import { getFormField } from "formsnap";

	type $$Props = SelectPrimitive.TriggerProps & {
		placeholder?: string;
	};
	type $$Events = SelectPrimitive.TriggerEvents;
	const { attrStore } = getFormField();
	interface Props {
		placeholder?: string;
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { placeholder = "", children, ...rest }: Props = $props();
</script>

<Select.Trigger {...rest} {...$attrStore} on:click on:keydown>
	<Select.Value {placeholder} />
	{@render children?.()}
</Select.Trigger>
