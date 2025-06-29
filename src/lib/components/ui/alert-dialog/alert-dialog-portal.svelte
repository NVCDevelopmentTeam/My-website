<!-- @migration-task Error while migrating Svelte code: The keyword 'interface' is reserved -->
<!-- @migration-task Error while migrating Svelte code: The keyword 'interface' is reserved -->
<script>
	import { AlertDialog as AlertDialogPrimitive } from "bits-ui";
	interface Props {
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { children, ...rest }: Props = $props();

	type $$Props = AlertDialogPrimitive.PortalProps;
</script>

<AlertDialogPrimitive.Portal {...rest}>
	{@render children?.()}
</AlertDialogPrimitive.Portal>
