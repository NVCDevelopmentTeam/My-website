<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<script>
	import { cn } from "$lib/utils";
	import type { HTMLAttributes } from "svelte/elements";
	import type { HeadingLevel } from ".";

	type $$Props = HTMLAttributes<HTMLHeadingElement> & {
		level?: HeadingLevel;
	};

	interface Props {
		class?: $$Props["class"];
		level?: $$Props["level"];
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { class: className = undefined, level = "h5", children, ...rest }: Props = $props();
	
</script>

<svelte:element
	this={level}
	class={cn("mb-1 font-medium leading-none tracking-tight", className)}
	{...rest}
>
	{@render children?.()}
</svelte:element>
