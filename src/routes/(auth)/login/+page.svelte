<script>
	import { loginSchema } from './schema';
	import { superForm } from 'sveltekit-superforms/client';
	import { zodClient } from 'sveltekit-superforms/adapters';
	
	let { data } = $props();
	
	// Initialize superForm with proper error handling
	const { form, enhance, errors, submitting } = superForm(data.form, {
		validators: zodClient(loginSchema),
		taintedMessage: 'Field has been modified',
		resetForm: false,
		clearOnSubmit: 'errors-and-message'
	});
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
				Sign in to your account
			</h2>
		</div>
		
		<form method="POST" use:enhance aria-label="Login form" class="mt-8 space-y-6">
			{#if !$form}
				<!-- Loading state while form initializes -->
				<div class="text-center">
					<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
					<p class="mt-2 text-sm text-gray-600">Initializing form...</p>
				</div>
			{:else}
				<div class="space-y-4">
					<!-- Email field -->
					<div>
						<label for="email" class="block text-sm font-medium text-gray-700 mb-1">
							Email address
						</label>
						<input 
							type="email" 
							id="email" 
							name="email"
							bind:value={$form.email} 
							class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="Enter your email"
							required
							disabled={$submitting}
						/>
						{#if $errors.email}
							<p class="mt-1 text-sm text-red-600" role="alert">
								{$errors.email[0]}
							</p>
						{/if}
					</div>
					
					<!-- Password field -->
					<div>
						<label for="password" class="block text-sm font-medium text-gray-700 mb-1">
							Password
						</label>
						<input 
							type="password" 
							id="password" 
							name="password"
							bind:value={$form.password} 
							class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="Enter your password"
							required
							disabled={$submitting}
						/>
						{#if $errors.password}
							<p class="mt-1 text-sm text-red-600" role="alert">
								{$errors.password[0]}
							</p>
						{/if}
					</div>
				</div>
				
				<!-- Submit button -->
				<div>
					<button 
						type="submit" 
						disabled={$submitting}
						class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
					>
						{#if $submitting}
							<div class="flex items-center">
								<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
								Signing in...
							</div>
						{:else}
							Sign in
						{/if}
					</button>
				</div>
			{/if}
		</form>
	</div>
</div>