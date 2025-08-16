<!-- src/routes/(auth)/login/+page.svelte -->
<script>
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let { data } = $props();

	const schema = z.object({
		email: z.string().email('Email không hợp lệ'),
		password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
	});

	const { form, errors, tainted, submitting, allErrors, message } = superForm(data.form, {
		validators: zod(schema),
		enhance: () => {
			return async ({ result }) => {
				if (result.type === 'success') {
					// Redirect to admin dashboard on successful login
					await goto('/admin');
				} else if (result.type === 'error') {
					// Display error message
					console.error('Login error:', result.errors);
				}
			};
		}
	});
</script>

<div class="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8 rounded-lg bg-card p-8 shadow-lg">
		<div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-foreground">Đăng nhập</h2>
			<p class="mt-2 text-center text-sm text-muted-foreground">Chỉ dành cho quản trị viên</p>
		</div>
		<form class="mt-8 space-y-6" method="POST" use:enhance>
			<div class="-space-y-px rounded-md shadow-sm">
				<div>
					<label for="email-address" class="sr-only">Địa chỉ Email</label>
					<input
						id="email-address"
						name="email"
						type="email"
						autocomplete="email"
						required
						class="relative block w-full appearance-none rounded-none rounded-t-md border border-input bg-input px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
						placeholder="Địa chỉ Email"
						bind:value={$form.email}
					/>
				</div>
				<div>
					<label for="password" class="sr-only">Mật khẩu</label>
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						class="relative block w-full appearance-none rounded-none rounded-b-md border border-input bg-input px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
						placeholder="Mật khẩu"
						bind:value={$form.password}
					/>
				</div>
			</div>

			{#if $allErrors.length > 0}
				<div class="text-red-500 text-sm" role="alert" aria-live="assertive">
					{#each $allErrors as error}
						<p>{error}</p>
					{/each}
				</div>
			{/if}

			{#if $message}
				<div class="text-green-500 text-sm" role="status" aria-live="polite">
					<p>{Array.isArray($message) ? $message.join(', ') : $message}</p>
				</div>
			{/if}

			<div>
				<button
					type="submit"
					class="group relative flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
					disabled={$submitting}
				>
					{#if $submitting}
						Đang đăng nhập...
					{:else}
						Đăng nhập
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
