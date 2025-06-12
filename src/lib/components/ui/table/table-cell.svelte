<script lang="ts">
	import { cn } from "$lib/utils";
	import type { HTMLTdAttributes } from "svelte/elements";

	type $$Props = HTMLTdAttributes;

	interface Props {
		class?: $$Props["class"];
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { class: className = undefined, children, ...rest }: Props = $props();
	
</script>

<td
	class={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
	{...rest}
>
	{@render children?.()}
</td>
