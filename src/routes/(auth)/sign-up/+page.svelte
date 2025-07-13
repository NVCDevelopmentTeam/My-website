<script>
	import { signUpSchema } from './schema';
	import { superForm } from 'sveltekit-superforms/client';
	import { zodClient } from 'sveltekit-superforms/adapters';
	
	let { data } = $props();
	
	// Initialize superForm with proper error handling
	const { form, enhance, errors, submitting, message } = superForm(data.form, {
		validators: zodClient(signUpSchema),
		taintedMessage: 'Field has been modified',
		resetForm: true,
		clearOnSubmit: 'errors-and-message',
		onUpdated: ({ form }) => {
			if (form.valid) {
				// Handle successful submission
				console.log('Form submitted successfully!');
			}
		}
	});
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
				Create your account
			</h2>
			<p class="mt-2 text-center text-sm text-gray-600">
				Join us today and get started
			</p>
		</div>
		
		<form method="POST" use:enhance aria-label="Sign up form" class="mt-8 space-y-6">
			{#if !$form}
				<!-- Loading state while form initializes -->
				<div class="text-center">
					<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
					<p class="mt-2 text-sm text-gray-600">Initializing form...</p>
				</div>
			{:else}
				<!-- Success/Error messages -->
				{#if $message}
					<div class="rounded-md bg-green-50 p-4">
						<div class="text-sm text-green-700">{$message}</div>
					</div>
				{/if}
				
				<div class="space-y-4">
					<!-- Email field -->
					<div>
						<label for="email" class="block text-sm font-medium text-gray-700 mb-1">
							Email address *
						</label>
						<input 
							type="email" 
							id="email" 
							name="email"
							bind:value={$form.email} 
							class="appearance-none relative block w-full px-3 py-2 border {$errors.email ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							class:border-red-300={$errors.email}
							placeholder="Enter your email"
							required
							disabled={$submitting}
							autocomplete="email"
						/>
						{#if $errors.email}
							<p class="mt-1 text-sm text-red-600" role="alert">
								{$errors.email[0]}
							</p>
						{/if}
					</div>
					
					<!-- First Name field -->
					<div>
						<label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
							First Name *
						</label>
						<input 
							type="text" 
							id="firstName" 
							name="firstName"
							bind:value={$form.firstName} 
							class="appearance-none relative block w-full px-3 py-2 border {$errors.firstName ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="Enter your first name"
							required
							disabled={$submitting}
							autocomplete="given-name"
						/>
						{#if $errors.firstName}
							<p class="mt-1 text-sm text-red-600" role="alert">
								{$errors.firstName[0]}
							</p>
						{/if}
					</div>
					
					<!-- Last Name field -->
					<div>
						<label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
							Last Name *
						</label>
						<input 
							type="text" 
							id="lastName" 
							name="lastName"
							bind:value={$form.lastName} 
							class="appearance-none relative block w-full px-3 py-2 border {$errors.lastName ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="Enter your last name"
							required
							disabled={$submitting}
							autocomplete="family-name"
						/>
						{#if $errors.lastName}
							<p class="mt-1 text-sm text-red-600" role="alert">
								{$errors.lastName[0]}
							</p>
						{/if}
					</div>
					
					<!-- Password field -->
					<div>
						<label for="password" class="block text-sm font-medium text-gray-700 mb-1">
							Password *
						</label>
						<input 
							type="password" 
							id="password" 
							name="password"
							bind:value={$form.password} 
							class="appearance-none relative block w-full px-3 py-2 border {$errors.password ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="Enter your password"
							required
							disabled={$submitting}
							autocomplete="new-password"
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
								Creating account...
							</div>
						{:else}
							<span class="absolute left-0 inset-y-0 flex items-center pl-3">
								<svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
								</svg>
							</span>
							Create Account
						{/if}
					</button>
				</div>
				
				<!-- Additional info -->
				<div class="text-center">
					<p class="text-sm text-gray-600">
						Already have an account? 
						<a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
							Sign in here
						</a>
					</p>
				</div>
			{/if}
		</form>
	</div>
</div>