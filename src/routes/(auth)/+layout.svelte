<script>
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let { children } = $props();

	onMount(() => {
		if (browser) {
			// Check if user is already logged in
			const token = localStorage.getItem('auth_token');
			if (token && (page.url.pathname === '/login' || page.url.pathname === '/signup')) {
				goto('/admin');
			}
		}
	});
</script>

<svelte:head>
	<title>Authentication - Coding Nguyễn</title>
	<meta
		name="description"
		content="Đăng nhập hoặc đăng ký tài khoản để quản trị website Coding Nguyễn"
	/>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8">
		<!-- Logo and branding -->
		<div class="text-center">
			<a href="/" class="inline-block">
				<img class="mx-auto h-12 w-auto" src="/logo.png" alt="Coding Nguyễn" />
			</a>
			<h1 class="mt-6 text-3xl font-extrabold text-gray-900">
				{#if page.url.pathname === '/login'}
					Đăng nhập
				{:else if page.url.pathname === '/signup'}
					Đăng ký tài khoản
				{:else}
					Xác thực
				{/if}
			</h1>
			<p class="mt-2 text-sm text-gray-600">
				{#if page.url.pathname === '/login'}
					Đăng nhập để quản trị website của bạn
				{:else if page.url.pathname === '/signup'}
					Tạo tài khoản quản trị mới
				{:else}
					Xác thực tài khoản của bạn
				{/if}
			</p>
		</div>

		<!-- Main content -->
		<div class="bg-white shadow-lg rounded-lg px-8 py-6">
			{@render children()}
		</div>

		<!-- Footer links -->
		<div class="text-center space-y-2">
			{#if page.url.pathname === '/login'}
				<p class="text-sm text-gray-600">
					Chưa có tài khoản?
					<a href="/signup" class="font-medium text-primary hover:text-primary-dark">
						Đăng ký ngay
					</a>
				</p>
			{:else if page.url.pathname === '/signup'}
				<p class="text-sm text-gray-600">
					Đã có tài khoản?
					<a href="/login" class="font-medium text-primary hover:text-primary-dark"> Đăng nhập </a>
				</p>
			{/if}

			<p class="text-sm text-gray-500">
				<a href="/" class="hover:text-gray-700"> ← Quay về trang chủ </a>
			</p>
		</div>
	</div>
</div>
