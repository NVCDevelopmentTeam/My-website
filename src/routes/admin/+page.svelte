<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let stats = $state({
		posts: 0,
		pages: 0,
		comments: 0,
		users: 0,
		views: 0,
		contacts: 0
	});

	let recentPosts = $state([]);
	let recentComments = $state([]);
	let recentContacts = $state([]);
	let loading = $state(true);

	onMount(async () => {
		if (browser) {
			await loadDashboardData();
		}
	});

	async function loadDashboardData() {
		try {
			// Load dashboard statistics
			const statsResponse = await fetch('/api/admin/stats');
			if (statsResponse.ok) {
				const statsData = await statsResponse.json();
				stats = { ...stats, ...statsData };
			}

			// Load recent posts
			const postsResponse = await fetch('/api/admin/posts?limit=5');
			if (postsResponse.ok) {
				const postsData = await postsResponse.json();
				recentPosts = postsData.posts || [];
			}

			// Load recent comments
			const commentsResponse = await fetch('/api/admin/comments?limit=5');
			if (commentsResponse.ok) {
				const commentsData = await commentsResponse.json();
				recentComments = commentsData.comments || [];
			}

			// Load recent contacts
			const contactsResponse = await fetch('/api/admin/contacts?limit=5');
			if (contactsResponse.ok) {
				const contactsData = await contactsResponse.json();
				recentContacts = contactsData.contacts || [];
			}
		} catch (error) {
			console.error('Error loading dashboard data:', error);
		} finally {
			loading = false;
		}
	}

	function formatDate(dateString) {
		if (!dateString) return 'N/A';
		return new Date(dateString).toLocaleDateString('vi-VN', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function formatNumber(num) {
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1) + 'M';
		} else if (num >= 1000) {
			return (num / 1000).toFixed(1) + 'K';
		}
		return num.toString();
	}
</script>

<svelte:head>
	<title>Dashboard - Admin Panel</title>
</svelte:head>

<div class="space-y-6">
	<!-- Welcome message -->
	<div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
		<h1 class="text-2xl font-bold mb-2">Chào mừng đến với Admin Panel!</h1>
		<p class="text-blue-100">Quản lý website Coding Nguyễn một cách dễ dàng và hiệu quả.</p>
	</div>

	<!-- Statistics cards -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
		<div class="bg-white rounded-lg shadow p-6">
			<div class="flex items-center">
				<div class="p-2 bg-blue-100 rounded-lg">
					<svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
					</svg>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600">Bài viết</p>
					<p class="text-2xl font-semibold text-gray-900">{formatNumber(stats.posts)}</p>
				</div>
			</div>
		</div>

		<div class="bg-white rounded-lg shadow p-6">
			<div class="flex items-center">
				<div class="p-2 bg-green-100 rounded-lg">
					<svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
						<path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
						<path fill-rule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd" />
					</svg>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600">Trang</p>
					<p class="text-2xl font-semibold text-gray-900">{formatNumber(stats.pages)}</p>
				</div>
			</div>
		</div>

		<div class="bg-white rounded-lg shadow p-6">
			<div class="flex items-center">
				<div class="p-2 bg-yellow-100 rounded-lg">
					<svg class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd" />
					</svg>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600">Bình luận</p>
					<p class="text-2xl font-semibold text-gray-900">{formatNumber(stats.comments)}</p>
				</div>
			</div>
		</div>

		<div class="bg-white rounded-lg shadow p-6">
			<div class="flex items-center">
				<div class="p-2 bg-purple-100 rounded-lg">
					<svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
						<path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
					</svg>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600">Người dùng</p>
					<p class="text-2xl font-semibold text-gray-900">{formatNumber(stats.users)}</p>
				</div>
			</div>
		</div>

		<div class="bg-white rounded-lg shadow p-6">
			<div class="flex items-center">
				<div class="p-2 bg-red-100 rounded-lg">
					<svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
						<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
						<path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.522 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
					</svg>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600">Lượt xem</p>
					<p class="text-2xl font-semibold text-gray-900">{formatNumber(stats.views)}</p>
				</div>
			</div>
		</div>

		<div class="bg-white rounded-lg shadow p-6">
			<div class="flex items-center">
				<div class="p-2 bg-indigo-100 rounded-lg">
					<svg class="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
						<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
						<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
					</svg>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600">Liên hệ</p>
					<p class="text-2xl font-semibold text-gray-900">{formatNumber(stats.contacts)}</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Recent content -->
	<div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
		<!-- Recent posts -->
		<div class="bg-white rounded-lg shadow">
			<div class="p-6 border-b border-gray-200">
				<div class="flex items-center justify-between">
					<h3 class="text-lg font-medium text-gray-900">Bài viết gần đây</h3>
					<a href="/admin/posts" class="text-sm text-blue-600 hover:text-blue-500">Xem tất cả</a>
				</div>
			</div>
			<div class="p-6">
				{#if loading}
					<div class="space-y-3">
						{#each Array(3) as _}
							<div class="animate-pulse">
								<div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
								<div class="h-3 bg-gray-200 rounded w-1/2"></div>
							</div>
						{/each}
					</div>
				{:else if recentPosts.length > 0}
					<div class="space-y-4">
						{#each recentPosts as post}
							<div class="border-b border-gray-100 pb-3 last:border-b-0">
								<h4 class="text-sm font-medium text-gray-900 mb-1">
									<a href="/admin/posts/{post.id}" class="hover:text-blue-600">
										{post.title}
									</a>
								</h4>
								<p class="text-xs text-gray-500">
									{formatDate(post.createdAt)} • {post.status}
								</p>
							</div>
						{/each}
					</div>
				{:else}
					<p class="text-gray-500 text-sm">Chưa có bài viết nào.</p>
				{/if}
			</div>
		</div>

		<!-- Recent comments -->
		<div class="bg-white rounded-lg shadow">
			<div class="p-6 border-b border-gray-200">
				<div class="flex items-center justify-between">
					<h3 class="text-lg font-medium text-gray-900">Bình luận gần đây</h3>
					<a href="/admin/comments" class="text-sm text-blue-600 hover:text-blue-500">Xem tất cả</a>
				</div>
			</div>
			<div class="p-6">
				{#if loading}
					<div class="space-y-3">
						{#each Array(3) as _}
							<div class="animate-pulse">
								<div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
								<div class="h-3 bg-gray-200 rounded w-1/2"></div>
							</div>
						{/each}
					</div>
				{:else if recentComments.length > 0}
					<div class="space-y-4">
						{#each recentComments as comment}
							<div class="border-b border-gray-100 pb-3 last:border-b-0">
								<p class="text-sm text-gray-900 mb-1">
									{comment.content?.substring(0, 100)}...
								</p>
								<p class="text-xs text-gray-500">
									{comment.author} • {formatDate(comment.createdAt)}
								</p>
							</div>
						{/each}
					</div>
				{:else}
					<p class="text-gray-500 text-sm">Chưa có bình luận nào.</p>
				{/if}
			</div>
		</div>

		<!-- Recent contacts -->
		<div class="bg-white rounded-lg shadow">
			<div class="p-6 border-b border-gray-200">
				<div class="flex items-center justify-between">
					<h3 class="text-lg font-medium text-gray-900">Liên hệ gần đây</h3>
					<a href="/admin/contacts" class="text-sm text-blue-600 hover:text-blue-500">Xem tất cả</a>
				</div>
			</div>
			<div class="p-6">
				{#if loading}
					<div class="space-y-3">
						{#each Array(3) as _}
							<div class="animate-pulse">
								<div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
								<div class="h-3 bg-gray-200 rounded w-1/2"></div>
							</div>
						{/each}
					</div>
				{:else if recentContacts.length > 0}
					<div class="space-y-4">
						{#each recentContacts as contact}
							<div class="border-b border-gray-100 pb-3 last:border-b-0">
								<h4 class="text-sm font-medium text-gray-900 mb-1">
									{contact.subject}
								</h4>
								<p class="text-xs text-gray-500">
									{contact.name} • {contact.email} • {formatDate(contact.createdAt)}
								</p>
							</div>
						{/each}
					</div>
				{:else}
					<p class="text-gray-500 text-sm">Chưa có liên hệ nào.</p>
				{/if}
			</div>
		</div>
	</div>

	<!-- Quick actions -->
	<div class="bg-white rounded-lg shadow p-6">
		<h3 class="text-lg font-medium text-gray-900 mb-4">Thao tác nhanh</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			<a
				href="/admin/posts/new"
				class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
			>
				<svg class="w-8 h-8 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				<div>
					<h4 class="text-sm font-medium text-gray-900">Tạo bài viết mới</h4>
					<p class="text-xs text-gray-500">Viết bài viết mới</p>
				</div>
			</a>

			<a
				href="/admin/pages/new"
				class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
			>
				<svg class="w-8 h-8 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
				</svg>
				<div>
					<h4 class="text-sm font-medium text-gray-900">Tạo trang mới</h4>
					<p class="text-xs text-gray-500">Thêm trang mới</p>
				</div>
			</a>

			<a
				href="/admin/media"
				class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
			>
				<svg class="w-8 h-8 text-purple-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
				</svg>
				<div>
					<h4 class="text-sm font-medium text-gray-900">Tải lên media</h4>
					<p class="text-xs text-gray-500">Quản lý hình ảnh</p>
				</div>
			</a>

			<a
				href="/admin/settings"
				class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
			>
				<svg class="w-8 h-8 text-gray-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
				</svg>
				<div>
					<h4 class="text-sm font-medium text-gray-900">Cài đặt</h4>
					<p class="text-xs text-gray-500">Cấu hình website</p>
				</div>
			</a>
		</div>
	</div>
</div>

