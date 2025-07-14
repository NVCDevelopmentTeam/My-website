<script>
	let name = $state('');
	let email = $state('');
	let title = $state('');
	let message = $state('');
	let status = $state('');

	const handleSubmit = async (event) => {
		event.preventDefault();
		status = 'Submitting...';

		const formData = {
			name,
			email,
			title,
			message
		};

		try {
			const response = await fetch('/api/submit.json', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify(formData)
			});

			const result = await response.json();

			if (response.ok && result.success) {
				status = result.message || 'Success';
				// Reset form fields after successful submission
				name = '';
				email = '';
				title = '';
				message = '';
			} else {
				status = result.message || 'An error occurred while processing your request';
			}
		} catch (error) {
			console.error('Error:', error);
			status = 'An error occurred while processing your request';
		}
	};
</script>

<form onsubmit={handleSubmit}>
	<div class="mb-4">
		<label for="name">Name *</label>
		<input
			type="text"
			id="name"
			bind:value={name}
			class="w-full px-4 py-2 border rounded-md bg-input text-foreground focus:ring-primary focus:border-primary"
			required
		/>
	</div>

	<div class="mb-4">
		<label for="email">Email *</label>
		<input
			type="email"
			id="email"
			bind:value={email}
			class="w-full px-4 py-2 border rounded-md bg-input text-foreground focus:ring-primary focus:border-primary"
			required
		/>
	</div>

	<div class="mb-4">
		<label for="title">Title *</label>
		<input
			type="text"
			id="title"
			bind:value={title}
			class="w-full px-4 py-2 border rounded-md bg-input text-foreground focus:ring-primary focus:border-primary"
			required
		/>
	</div>

	<div class="mb-4">
		<label for="message">Message *</label>
		<textarea
			id="message"
			bind:value={message}
			class="w-full px-4 py-2 border rounded-md bg-input text-foreground focus:ring-primary focus:border-primary"
			required
		></textarea>
	</div>

	<button
		type="submit"
		class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
		>Submit</button
	>

	{#if status}
		<p>{status}</p>
	{/if}
</form>
