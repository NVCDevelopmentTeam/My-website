<script>
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let { children } = $props();
	let user = $state(null);
	let sidebarOpen = $state(false);

	onMount(() => {
		if (browser) {
			// Check authentication
			const token = localStorage.getItem('auth_token');
			const userInfo = localStorage.getItem('user_info');

			if (!token) {
				goto('/login');
				return;
			}

			if (userInfo) {
				try {
					user = JSON.parse(userInfo);
				} catch (error) {
					console.error('Error parsing user info:', error);
					goto('/login');
				}
			}
		}
	});

	function logout() {
		if (browser) {
			localStorage.removeItem('auth_token');
			localStorage.removeItem('user_info');
			localStorage.removeItem('remember_me');
			goto('/login');
		}
	}

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	const menuItems = [
		{ title: 'Dashboard', href: '/admin', icon: 'dashboard' },
		{ title: 'Bài viết', href: '/admin/posts', icon: 'posts' },
		{ title: 'Trang', href: '/admin/pages', icon: 'pages' },
		{ title: 'Danh mục', href: '/admin/categories', icon: 'categories' },
		{ title: 'Thẻ', href: '/admin/tags', icon: 'tags' },
		{ title: 'Media', href: '/admin/media', icon: 'media' },
		{ title: 'Bình luận', href: '/admin/comments', icon: 'comments' },
		{ title: 'Liên hệ', href: '/admin/contacts', icon: 'contacts' },
		{ title: 'Người dùng', href: '/admin/users', icon: 'users' },
		{ title: 'Cài đặt', href: '/admin/settings', icon: 'settings' }
	];
</script>

<svelte:head>
	<title>Admin Dashboard - Coding Nguyễn</title>
	<meta name="description" content="Quản trị website Coding Nguyễn" />
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen bg-gray-100">
	<!-- Sidebar -->
	<div
		class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform {sidebarOpen
			? 'translate-x-0'
			: '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0"
	>
		<div class="flex items-center justify-center h-16 bg-primary">
			<h1 class="text-white text-xl font-bold">Admin Panel</h1>
		</div>

		<nav class="mt-8">
			<ul class="space-y-2 px-4">
				{#each menuItems as item}
					<li>
						<a
							href={item.href}
							class="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors {page
								.url.pathname === item.href
								? 'bg-primary text-white'
								: ''}"
						>
							<span class="w-5 h-5 mr-3">
								{#if item.icon === 'dashboard'}
									<svg fill="currentColor" viewBox="0 0 20 20">
										<path
											d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
										/>
									</svg>
								{:else if item.icon === 'posts'}
									<svg fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
											clip-rule="evenodd"
										/>
									</svg>
								{:else if item.icon === 'pages'}
									<svg fill="currentColor" viewBox="0 0 20 20">
										<path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
										<path
											fill-rule="evenodd"
											d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
											clip-rule="evenodd"
										/>
									</svg>
								{:else if item.icon === 'categories'}
									<svg fill="currentColor" viewBox="0 0 20 20">
										<path
											d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"
										/>
									</svg>
								{:else if item.icon === 'tags'}
									<svg fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
											clip-rule="evenodd"
										/>
									</svg>
								{:else if item.icon === 'media'}
									<svg fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
											clip-rule="evenodd"
										/>
									</svg>
								{:else if item.icon === 'comments'}
									<svg fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
											clip-rule="evenodd"
										/>
									</svg>
								{:else if item.icon === 'contacts'}
									<svg fill="currentColor" viewBox="0 0 20 20">
										<path
											d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
										/>
										<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
									</svg>
								{:else if item.icon === 'users'}
									<svg fill="currentColor" viewBox="0 0 20 20">
										<path
											d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"
										/>
									</svg>
								{:else if item.icon === 'settings'}
									<svg fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
											clip-rule="evenodd"
										/>
									</svg>
								{/if}
							</span>
							{item.title}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>

	<!-- Main content -->
	<div class="lg:ml-64">
		<!-- Top bar -->
		<header class="bg-white shadow-sm border-b border-gray-200">
			<div class="flex items-center justify-between px-6 py-4">
				<div class="flex items-center">
					<button
						class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
						onclick={toggleSidebar}
						aria-label="Toggle sidebar"
					>
						<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
					<h2 class="ml-4 text-xl font-semibold text-gray-800">
						{#if page.url.pathname === '/admin'}
							Dashboard
						{:else if page.url.pathname.includes('/posts')}
							Quản lý bài viết
						{:else if page.url.pathname.includes('/pages')}
							Quản lý trang
						{:else if page.url.pathname.includes('/categories')}
							Quản lý danh mục
						{:else if page.url.pathname.includes('/tags')}
							Quản lý thẻ
						{:else if page.url.pathname.includes('/media')}
							Quản lý media
						{:else if page.url.pathname.includes('/comments')}
							Quản lý bình luận
						{:else if page.url.pathname.includes('/contacts')}
							Quản lý liên hệ
						{:else if page.url.pathname.includes('/users')}
							Quản lý người dùng
						{:else if page.url.pathname.includes('/settings')}
							Cài đặt
						{:else}
							Admin Panel
						{/if}
					</h2>
				</div>

				<div class="flex items-center space-x-4">
					<!-- User menu -->
					<div class="relative">
						<div class="flex items-center space-x-3">
							<span class="text-sm text-gray-700">
								Xin chào, <strong>{user?.name || 'Admin'}</strong>
							</span>
							<button
								class="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
								onclick={logout}
							>
								<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
									/>
								</svg>
								<span>Đăng xuất</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</header>

		<!-- Page content -->
		<main class="p-6">
			{@render children()}
		</main>
	</div>
</div>

<!-- Sidebar overlay for mobile -->
{#if sidebarOpen}
	<div
		class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
		onclick={toggleSidebar}
		onkeydown={(e) => e.key === 'Enter' && toggleSidebar()}
		role="button"
		tabindex="0"
	></div>
{/if}

<style>
	/* Custom scrollbar for sidebar */
	nav {
		scrollbar-width: thin;
		scrollbar-color: #cbd5e0 #f7fafc;
	}

	nav::-webkit-scrollbar {
		width: 6px;
	}

	nav::-webkit-scrollbar-track {
		background: #f7fafc;
	}

	nav::-webkit-scrollbar-thumb {
		background: #cbd5e0;
		border-radius: 3px;
	}

	nav::-webkit-scrollbar-thumb:hover {
		background: #a0aec0;
	}
</style>
