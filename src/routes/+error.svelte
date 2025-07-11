<script>
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>404 – Page Not Found</title>
	<meta name="description" content="The page you are looking for does not exist." />
</svelte:head>

<main class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
	<h1 class="text-5xl font-bold text-gray-800 mb-4">404 – Page Not Found</h1>

	<p class="text-lg text-gray-600 mb-6 text-center max-w-md">
		The page you are looking for does not exist.<br />
		Please <a href="/" class="text-blue-600 hover:underline">go back home</a>
		or <a href="/contact" class="text-blue-600 hover:underline">contact us</a>.
	</p>

	{#if page.error}
		<details class="bg-white p-4 rounded shadow mb-6 max-w-md w-full">
			<summary class="font-medium cursor-pointer text-gray-700">Error details</summary>
			<pre class="mt-2 text-sm text-red-600 bg-gray-100 p-2 rounded overflow-x-auto">
{page.error.message}
{page.error.stack}
      </pre>
		</details>
	{/if}
</main>
