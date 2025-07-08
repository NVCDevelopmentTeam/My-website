<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<script>
	import { Form as FormPrimitive } from 'formsnap';
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	type $$Props = HTMLAttributes<HTMLParagraphElement>;
	interface Props {
		class?: string | undefined | null;
		[key: string]: any;
	}

	let { class: className = undefined, ...rest }: Props = $props();
</script>

<FormPrimitive.Validation class={cn('text-sm font-medium text-destructive', className)} {...rest} />
