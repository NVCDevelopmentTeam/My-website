<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<script>
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils";
	import type { HeadingLevel } from ".";

	type $$Props = HTMLAttributes<HTMLHeadingElement> & {
		tag?: HeadingLevel;
	};

	interface Props {
		class?: $$Props["class"];
		tag?: $$Props["tag"];
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { class: className = undefined, tag = "h3", children, ...rest }: Props = $props();
	
</script>

<svelte:element
	this={tag}
	class={cn("text-lg font-semibold leading-none tracking-tight", className)}
	{...rest}
>
	{@render children?.()}
</svelte:element>
