<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let { form } = $props();
	
	let email = $state('');
	let password = $state('');
	let rememberMe = $state(false);
	let showPassword = $state(false);
	let loading = $state(false);

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}

	function handleSubmit() {
		loading = true;
	}

	// Handle successful login
	$effect(() => {
		if (form?.success && browser) {
			// Store auth token
			if (form.token) {
				localStorage.setItem('auth_token', form.token);
			}
			
			// Store user info
			if (form.user) {
				localStorage.setItem('user_info', JSON.stringify(form.user));
			}

			// Remember me functionality
			if (rememberMe) {
				localStorage.setItem('remember_me', 'true');
				localStorage.setItem('user_email', email);
			}

			// Redirect to admin dashboard
			goto('/admin');
		}
		loading = false;
	});

	// Load remembered email on mount
	$effect(() => {
		if (browser) {
			const rememberedEmail = localStorage.getItem('user_email');
			const rememberFlag = localStorage.getItem('remember_me');
			
			if (rememberFlag === 'true' && rememberedEmail) {
				email = rememberedEmail;
				rememberMe = true;
			}
		}
	});
</script>

<svelte:head>
	<title>Đăng nhập - Coding Nguyễn</title>
</svelte:head>

<form method="POST" action="?/login" use:enhance={handleSubmit}>
	<!-- Email field -->
	<div class="mb-4">
		<label for="email" class="block text-sm font-medium text-gray-700 mb-2">
			Email
		</label>
		<input
			id="email"
			name="email"
			type="email"
			autocomplete="email"
			required
			bind:value={email}
			class="auth-input"
			placeholder="Nhập địa chỉ email của bạn"
			aria-describedby={form?.errors?.email ? 'email-error' : undefined}
		/>
		{#if form?.errors?.email}
			<p id="email-error" class="auth-error" role="alert">
				{form.errors.email}
			</p>
		{/if}
	</div>

	<!-- Password field -->
	<div class="mb-4">
		<label for="password" class="block text-sm font-medium text-gray-700 mb-2">
			Mật khẩu
		</label>
		<div class="relative">
			<input
				id="password"
				name="password"
				type={showPassword ? 'text' : 'password'}
				autocomplete="current-password"
				required
				bind:value={password}
				class="auth-input pr-10"
				placeholder="Nhập mật khẩu của bạn"
				aria-describedby={form?.errors?.password ? 'password-error' : undefined}
			/>
			<button
				type="button"
				class="absolute inset-y-0 right-0 pr-3 flex items-center"
				onclick={togglePasswordVisibility}
				aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
			>
				{#if showPassword}
					<!-- Eye slash icon -->
					<svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
					</svg>
				{:else}
					<!-- Eye icon -->
					<svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
					</svg>
				{/if}
			</button>
		</div>
		{#if form?.errors?.password}
			<p id="password-error" class="auth-error" role="alert">
				{form.errors.password}
			</p>
		{/if}
	</div>

	<!-- Remember me and forgot password -->
	<div class="flex items-center justify-between mb-6">
		<div class="flex items-center">
			<input
				id="remember-me"
				name="remember-me"
				type="checkbox"
				bind:checked={rememberMe}
				class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
			/>
			<label for="remember-me" class="ml-2 block text-sm text-gray-900">
				Ghi nhớ đăng nhập
			</label>
		</div>

		<div class="text-sm">
			<a href="/forgot-password" class="font-medium text-primary hover:text-primary-dark">
				Quên mật khẩu?
			</a>
		</div>
	</div>

	<!-- Submit button -->
	<div class="mb-4">
		<button
			type="submit"
			disabled={loading}
			class="auth-button"
		>
			{#if loading}
				<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				Đang đăng nhập...
			{:else}
				Đăng nhập
			{/if}
		</button>
	</div>

	<!-- General error message -->
	{#if form?.error}
		<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
			<p class="text-red-600 text-sm" role="alert">
				{form.error}
			</p>
		</div>
	{/if}

	<!-- Success message -->
	{#if form?.success}
		<div class="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
			<p class="text-green-600 text-sm" role="alert">
				Đăng nhập thành công! Đang chuyển hướng...
			</p>
		</div>
	{/if}
</form>

<!-- Additional features -->
<div class="mt-6 border-t border-gray-200 pt-6">
	<div class="text-center">
		<p class="text-sm text-gray-600 mb-4">
			Hoặc đăng nhập bằng
		</p>
		
		<!-- Social login buttons (placeholder) -->
		<div class="space-y-2">
			<button
				type="button"
				class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
				disabled
			>
				<svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
					<path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
					<path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
					<path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
					<path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
				</svg>
				Đăng nhập với Google (Sắp có)
			</button>
		</div>
	</div>
</div>

