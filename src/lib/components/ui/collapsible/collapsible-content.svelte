<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<script>
	import { Collapsible as CollapsiblePrimitive } from "bits-ui";
	import { slide } from "svelte/transition";

	type $$Props = CollapsiblePrimitive.ContentProps;

	interface Props {
		transition?: $$Props["transition"];
		transitionConfig?: $$Props["transitionConfig"];
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { transition = slide, transitionConfig = {
		duration: 150
	}, children, ...rest }: Props = $props();
</script>

<CollapsiblePrimitive.Content {transition} {transitionConfig} {...rest}>
	{@render children?.()}
</CollapsiblePrimitive.Content>
