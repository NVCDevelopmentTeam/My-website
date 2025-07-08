<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<script>
	import { Select as SelectPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	type $$Props = SelectPrimitive.SeparatorProps;

	interface Props {
		class?: $$Props['class'];
		[key: string]: any;
	}

	let { class: className = undefined, ...rest }: Props = $props();
</script>

<SelectPrimitive.Separator class={cn('-mx-1 my-1 h-px bg-muted', className)} {...rest} />
