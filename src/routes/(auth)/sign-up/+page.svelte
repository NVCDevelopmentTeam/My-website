<script>
	import { enhance } from '$app/forms';

	// Remove TypeScript-specific import
	

	// Use plain JavaScript variable declaration without type annotations
	let data = $props();
</script>

<form method="POST" use:enhance aria-label="Sign up form" class="space-y-6">
	{#if !data.form}
		<!-- Debug: show error if form is undefined -->
		<p class="text-red-500">Error: form not initialized</p>
	{/if}

	<!-- Email field -->
	<div>
		<label for="email">Email</label>
		<input type="email" id="email" name="email" bind:value={data.form.email} />
		{#if data.form.errors.email}
			<p>{data.form.errors.email}</p>
		{/if}
	</div>

	<!-- First Name field -->
	<div>
		<label for="firstName">First Name</label>
		<input type="text" id="firstName" name="firstName" bind:value={data.form.firstName} />
		{#if data.form.errors.firstName}
			<p>{data.form.errors.firstName}</p>
		{/if}
	</div>

	<!-- Last Name field -->
	<div>
		<label for="lastName">Last Name</label>
		<input type="text" id="lastName" name="lastName" bind:value={data.form.lastName} />
		{#if data.form.errors.lastName}
			<p>{data.form.errors.lastName}</p>
		{/if}
	</div>

	<!-- Password field -->
	<div>
		<label for="password">Password</label>
		<input type="password" id="password" name="password" bind:value={data.form.password} />
		{#if data.form.errors.password}
			<p>{data.form.errors.password}</p>
		{/if}
	</div>

	<!-- Submit button -->
	<button type="submit">Register</button>
</form>
