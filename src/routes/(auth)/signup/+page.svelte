<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let { form } = $props();

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let loading = $state(false);
	let step = $state(1); // 1: Registration form, 2: OTP verification
	let otp = $state('');
	let otpSent = $state(false);

	// Password strength indicators
	let passwordStrength = $derived(() => {
		if (!password) return { score: 0, text: '', color: '' };

		let score = 0;
		let feedback = [];

		// Length check
		if (password.length >= 8) score += 1;
		else feedback.push('ít nhất 8 ký tự');

		// Uppercase check
		if (/[A-Z]/.test(password)) score += 1;
		else feedback.push('chữ hoa');

		// Lowercase check
		if (/[a-z]/.test(password)) score += 1;
		else feedback.push('chữ thường');

		// Number check
		if (/\d/.test(password)) score += 1;
		else feedback.push('số');

		// Special character check
		if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
		else feedback.push('ký tự đặc biệt');

		const strength = {
			0: { text: 'Rất yếu', color: 'text-red-600' },
			1: { text: 'Yếu', color: 'text-red-500' },
			2: { text: 'Trung bình', color: 'text-yellow-500' },
			3: { text: 'Khá', color: 'text-blue-500' },
			4: { text: 'Mạnh', color: 'text-green-500' },
			5: { text: 'Rất mạnh', color: 'text-green-600' }
		};

		return {
			score,
			text: strength[score]?.text || '',
			color: strength[score]?.color || '',
			feedback: feedback.length > 0 ? `Cần thêm: ${feedback.join(', ')}` : 'Mật khẩu mạnh!'
		};
	});

	// Password match check
	let passwordsMatch = $derived(password && confirmPassword && password === confirmPassword);

	function togglePasswordVisibility(field) {
		if (field === 'password') {
			showPassword = !showPassword;
		} else {
			showConfirmPassword = !showConfirmPassword;
		}
	}

	function handleSubmit() {
		loading = true;
	}

	// Handle form responses
	$effect(() => {
		if (form?.otpSent) {
			step = 2;
			otpSent = true;
		}

		if (form?.success && browser) {
			// Registration successful, redirect to login
			goto('/login?message=registration-success');
		}

		loading = false;
	});

	function resendOTP() {
		// Implement OTP resend logic
		console.log('Resending OTP...');
	}
</script>

<svelte:head>
	<title>Đăng ký - Coding Nguyễn</title>
</svelte:head>

{#if step === 1}
	<!-- Registration Form -->
	<form method="POST" action="?/register" use:enhance={handleSubmit}>
		<!-- Name field -->
		<div class="mb-4">
			<label for="name" class="block text-sm font-medium text-gray-700 mb-2"> Họ và tên </label>
			<input
				id="name"
				name="name"
				type="text"
				autocomplete="name"
				required
				bind:value={name}
				class="auth-input"
				placeholder="Nhập họ và tên của bạn"
				aria-describedby={form?.error ? 'name-error' : undefined}
			/>
		</div>

		<!-- Email field -->
		<div class="mb-4">
			<label for="email" class="block text-sm font-medium text-gray-700 mb-2"> Email </label>
			<input
				id="email"
				name="email"
				type="email"
				autocomplete="email"
				required
				bind:value={email}
				class="auth-input"
				placeholder="Nhập địa chỉ email của bạn"
				aria-describedby={form?.error ? 'email-error' : undefined}
			/>
		</div>

		<!-- Password field -->
		<div class="mb-4">
			<label for="password" class="block text-sm font-medium text-gray-700 mb-2"> Mật khẩu </label>
			<div class="relative">
				<input
					id="password"
					name="password"
					type={showPassword ? 'text' : 'password'}
					autocomplete="new-password"
					required
					bind:value={password}
					class="auth-input pr-10"
					placeholder="Tạo mật khẩu mạnh"
					aria-describedby="password-strength password-error"
				/>
				<button
					type="button"
					class="absolute inset-y-0 right-0 pr-3 flex items-center"
					onclick={() => togglePasswordVisibility('password')}
					aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
				>
					{#if showPassword}
						<svg
							class="h-5 w-5 text-gray-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
							/>
						</svg>
					{:else}
						<svg
							class="h-5 w-5 text-gray-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
							/>
						</svg>
					{/if}
				</button>
			</div>

			<!-- Password strength indicator -->
			{#if password}
				<div id="password-strength" class="mt-2">
					<div class="flex items-center space-x-2">
						<div class="flex-1 bg-gray-200 rounded-full h-2">
							<div
								class="h-2 rounded-full transition-all duration-300 {/** @type {any} */ (
									passwordStrength
								).score >= 3
									? 'bg-green-500'
									: /** @type {any} */ (passwordStrength).score >= 2
										? 'bg-yellow-500'
										: 'bg-red-500'}"
								style="width: {/** @type {any} */ (passwordStrength().score / 5) * 100}%"
							></div>
						</div>
						<span class="text-xs {/** @type {any} */ (passwordStrength).color}">
							{/** @type {any} */ (passwordStrength).text}
						</span>
					</div>
					<p class="text-xs text-gray-600 mt-1">
						{/** @type {any} */ (passwordStrength).feedback}
					</p>
				</div>
			{/if}
		</div>

		<!-- Confirm Password field -->
		<div class="mb-6">
			<label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-2">
				Xác nhận mật khẩu
			</label>
			<div class="relative">
				<input
					id="confirm-password"
					name="confirm-password"
					type={showConfirmPassword ? 'text' : 'password'}
					autocomplete="new-password"
					required
					bind:value={confirmPassword}
					class="auth-input pr-10"
					placeholder="Nhập lại mật khẩu"
					aria-describedby="confirm-password-match"
				/>
				<button
					type="button"
					class="absolute inset-y-0 right-0 pr-3 flex items-center"
					onclick={() => togglePasswordVisibility('confirm')}
					aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
				>
					{#if showConfirmPassword}
						<svg
							class="h-5 w-5 text-gray-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
							/>
						</svg>
					{:else}
						<svg
							class="h-5 w-5 text-gray-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
							/>
						</svg>
					{/if}
				</button>
			</div>

			<!-- Password match indicator -->
			{#if confirmPassword}
				<div id="confirm-password-match" class="mt-1">
					{#if passwordsMatch}
						<p class="text-green-600 text-xs flex items-center">
							<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
							Mật khẩu khớp
						</p>
					{:else}
						<p class="text-red-600 text-xs flex items-center">
							<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
							Mật khẩu không khớp
						</p>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Submit button -->
		<div class="mb-4">
			<button
				type="submit"
				disabled={loading || !passwordsMatch || /** @type {any} */ (passwordStrength).score < 3}
				class="auth-button"
			>
				{#if loading}
					<svg
						class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					Đang tạo tài khoản...
				{:else}
					Tạo tài khoản
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
	</form>
{:else if step === 2}
	<!-- OTP Verification Form -->
	<form method="POST" action="?/verify-otp" use:enhance={handleSubmit}>
		<input type="hidden" name="email" value={email} />

		<div class="text-center mb-6">
			<svg
				class="mx-auto h-12 w-12 text-green-500"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
				/>
			</svg>
			<h3 class="text-lg font-medium text-gray-900 mt-2">Xác thực email</h3>
			<p class="text-sm text-gray-600 mt-1">
				Chúng tôi đã gửi mã xác thực 6 chữ số đến email <strong>{email}</strong>
			</p>
		</div>

		<!-- OTP input -->
		<div class="mb-6">
			<label for="otp" class="block text-sm font-medium text-gray-700 mb-2">
				Mã xác thực (OTP)
			</label>
			<input
				id="otp"
				name="otp"
				type="text"
				inputmode="numeric"
				pattern="[0-9]{6}"
				maxlength="6"
				required
				bind:value={otp}
				class="auth-input text-center text-2xl tracking-widest"
				placeholder="000000"
				aria-describedby={form?.error ? 'otp-error' : undefined}
			/>
		</div>

		<!-- Submit button -->
		<div class="mb-4">
			<button type="submit" disabled={loading || otp.length !== 6} class="auth-button">
				{#if loading}
					<svg
						class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					Đang xác thực...
				{:else}
					Xác thực tài khoản
				{/if}
			</button>
		</div>

		<!-- Resend OTP -->
		<div class="text-center">
			<p class="text-sm text-gray-600">
				Không nhận được mã?
				<button
					type="button"
					class="font-medium text-primary hover:text-primary-dark"
					onclick={resendOTP}
				>
					Gửi lại mã
				</button>
			</p>
		</div>

		<!-- General error message -->
		{#if form?.error}
			<div class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
				<p class="text-red-600 text-sm" role="alert">
					{form.error}
				</p>
			</div>
		{/if}
	</form>
{/if}

<!-- Terms and Privacy -->
<div class="mt-6 text-center">
	<p class="text-xs text-gray-500">
		Bằng cách đăng ký, bạn đồng ý với
		<a href="/terms" class="text-primary hover:text-primary-dark">Điều khoản sử dụng</a>
		và
		<a href="/privacy" class="text-primary hover:text-primary-dark">Chính sách bảo mật</a>
		của chúng tôi.
	</p>
</div>
