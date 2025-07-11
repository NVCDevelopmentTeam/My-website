<script>
	import { loginSchema } from './schema'; // import Zod schema
	import { superForm } from 'sveltekit-superforms/client'; // client-side form hook
	import { zodClient } from 'sveltekit-superforms/adapters'; // adapter for client validation

	let { data } = $props();

	// Initialize superForm with server data and setup client-side validation
	const { form, enhance } = superForm(data.form, {
		validators: zodClient(loginSchema), // Zod-based validation on client
		taintedMessage: 'Field has been modified'
	});
</script>

<form method="POST" use:enhance aria-label="Login form" class="space-y-6">
	{#if !form}
		<!-- Debug: show error if form is undefined -->
		<p class="text-red-500">Error: form not initialized</p>
	{/if}

	<!-- Email field -->
	<div>
		<div>
			<label for="email">Email</label>
			<input type="email" id="email" bind:value={$form.email} />
			{#if $form.errors.email}
				<p>{$form.errors.email}</p>
			{/if}
		</div>
	</div>

	<!-- Password field -->
	<div>
		<div>
			<label for="password">Password</label>
			<input type="password" id="password" bind:value={$form.password} />
			{#if $form.errors.password}
				<p>{$form.errors.password}</p>
			{/if}
		</div>
	</div>

	<!-- Submit button -->
	<button type="submit">Login</button>
</form>
