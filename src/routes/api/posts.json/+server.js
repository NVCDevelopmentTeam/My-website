import { json } from '@sveltejs/kit';

// Mock data for posts - in production this would come from a database
const mockPosts = [
	{
		id: 1,
		title: 'Chào mừng đến với Coding Nguyễn',
		slug: 'chao-mung-den-voi-coding-nguyen',
		excerpt: 'Khám phá thế giới lập trình và accessibility cùng tôi. Tìm hiểu về các công nghệ web hiện đại và cách xây dựng ứng dụng thân thiện với người dùng.',
		content: 'Nội dung đầy đủ của bài viết...',
		publishedAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		status: 'published',
		featured: true,
		author: {
			id: 1,
			name: 'Coding Nguyễn',
			email: 'coding@nguyen.dev',
			avatar: '/images/avatar.jpg'
		},
		categories: [
			{ id: 1, name: 'Giới thiệu', slug: 'gioi-thieu' }
		],
		tags: [
			{ id: 1, name: 'Welcome', slug: 'welcome' },
			{ id: 2, name: 'Introduction', slug: 'introduction' }
		],
		readingTime: 3,
		viewCount: 150,
		thumbnail: '/images/posts/welcome.jpg',
		seo: {
			metaTitle: 'Chào mừng đến với Coding Nguyễn - Blog về lập trình',
			metaDescription: 'Khám phá thế giới lập trình và accessibility cùng Coding Nguyễn',
			keywords: ['lập trình', 'accessibility', 'web development']
		}
	},
	{
		id: 2,
		title: 'Hướng dẫn Accessibility cho người mới bắt đầu',
		slug: 'huong-dan-accessibility-cho-nguoi-moi-bat-dau',
		excerpt: 'Tìm hiểu các nguyên tắc cơ bản về khả năng truy cập web và cách áp dụng chúng trong dự án của bạn.',
		content: 'Nội dung đầy đủ của bài viết về accessibility...',
		publishedAt: new Date(Date.now() - 86400000).toISOString(),
		updatedAt: new Date(Date.now() - 86400000).toISOString(),
		status: 'published',
		featured: false,
		author: {
			id: 1,
			name: 'Coding Nguyễn',
			email: 'coding@nguyen.dev',
			avatar: '/images/avatar.jpg'
		},
		categories: [
			{ id: 2, name: 'A11y', slug: 'a11y' },
			{ id: 3, name: 'Tutorial', slug: 'tutorial' }
		],
		tags: [
			{ id: 3, name: 'Accessibility', slug: 'accessibility' },
			{ id: 4, name: 'WCAG', slug: 'wcag' },
			{ id: 5, name: 'Screen Reader', slug: 'screen-reader' }
		],
		readingTime: 8,
		viewCount: 89,
		thumbnail: '/images/posts/accessibility.jpg',
		seo: {
			metaTitle: 'Hướng dẫn Accessibility cho người mới bắt đầu',
			metaDescription: 'Tìm hiểu các nguyên tắc cơ bản về khả năng truy cập web',
			keywords: ['accessibility', 'a11y', 'wcag', 'screen reader']
		}
	},
	{
		id: 3,
		title: 'SvelteKit và TailwindCSS: Combo hoàn hảo',
		slug: 'sveltekit-va-tailwindcss-combo-hoan-hao',
		excerpt: 'Xây dựng ứng dụng web hiện đại với SvelteKit và TailwindCSS. Tìm hiểu cách kết hợp hai công nghệ này để tạo ra giao diện đẹp và hiệu suất cao.',
		content: 'Nội dung đầy đủ về SvelteKit và TailwindCSS...',
		publishedAt: new Date(Date.now() - 172800000).toISOString(),
		updatedAt: new Date(Date.now() - 172800000).toISOString(),
		status: 'published',
		featured: true,
		author: {
			id: 1,
			name: 'Coding Nguyễn',
			email: 'coding@nguyen.dev',
			avatar: '/images/avatar.jpg'
		},
		categories: [
			{ id: 4, name: 'Web Development', slug: 'web-development' },
			{ id: 5, name: 'Frontend', slug: 'frontend' }
		],
		tags: [
			{ id: 6, name: 'SvelteKit', slug: 'sveltekit' },
			{ id: 7, name: 'TailwindCSS', slug: 'tailwindcss' },
			{ id: 8, name: 'CSS Framework', slug: 'css-framework' }
		],
		readingTime: 12,
		viewCount: 234,
		thumbnail: '/images/posts/sveltekit-tailwind.jpg',
		seo: {
			metaTitle: 'SvelteKit và TailwindCSS: Combo hoàn hảo cho Web Development',
			metaDescription: 'Xây dựng ứng dụng web hiện đại với SvelteKit và TailwindCSS',
			keywords: ['sveltekit', 'tailwindcss', 'web development', 'frontend']
		}
	},
	{
		id: 4,
		title: 'Tối ưu hóa Performance cho Website',
		slug: 'toi-uu-hoa-performance-cho-website',
		excerpt: 'Các kỹ thuật và best practices để tối ưu hóa hiệu suất website, từ lazy loading đến code splitting.',
		content: 'Nội dung về performance optimization...',
		publishedAt: new Date(Date.now() - 259200000).toISOString(),
		updatedAt: new Date(Date.now() - 259200000).toISOString(),
		status: 'published',
		featured: false,
		author: {
			id: 1,
			name: 'Coding Nguyễn',
			email: 'coding@nguyen.dev',
			avatar: '/images/avatar.jpg'
		},
		categories: [
			{ id: 6, name: 'Performance', slug: 'performance' },
			{ id: 7, name: 'Optimization', slug: 'optimization' }
		],
		tags: [
			{ id: 9, name: 'Performance', slug: 'performance' },
			{ id: 10, name: 'Lazy Loading', slug: 'lazy-loading' },
			{ id: 11, name: 'Code Splitting', slug: 'code-splitting' }
		],
		readingTime: 15,
		viewCount: 178,
		thumbnail: '/images/posts/performance.jpg',
		seo: {
			metaTitle: 'Tối ưu hóa Performance cho Website - Hướng dẫn chi tiết',
			metaDescription: 'Các kỹ thuật và best practices để tối ưu hóa hiệu suất website',
			keywords: ['performance', 'optimization', 'lazy loading', 'code splitting']
		}
	},
	{
		id: 5,
		title: 'Socket.io và Real-time Communication',
		slug: 'socketio-va-realtime-communication',
		excerpt: 'Xây dựng ứng dụng real-time với Socket.io. Tìm hiểu cách tạo chat, notifications và live updates.',
		content: 'Nội dung về Socket.io và real-time...',
		publishedAt: new Date(Date.now() - 345600000).toISOString(),
		updatedAt: new Date(Date.now() - 345600000).toISOString(),
		status: 'published',
		featured: false,
		author: {
			id: 1,
			name: 'Coding Nguyễn',
			email: 'coding@nguyen.dev',
			avatar: '/images/avatar.jpg'
		},
		categories: [
			{ id: 8, name: 'Real-time', slug: 'realtime' },
			{ id: 9, name: 'Backend', slug: 'backend' }
		],
		tags: [
			{ id: 12, name: 'Socket.io', slug: 'socketio' },
			{ id: 13, name: 'WebSocket', slug: 'websocket' },
			{ id: 14, name: 'Real-time', slug: 'realtime' }
		],
		readingTime: 10,
		viewCount: 156,
		thumbnail: '/images/posts/socketio.jpg',
		seo: {
			metaTitle: 'Socket.io và Real-time Communication - Hướng dẫn từ A-Z',
			metaDescription: 'Xây dựng ứng dụng real-time với Socket.io',
			keywords: ['socket.io', 'websocket', 'real-time', 'chat']
		}
	}
];

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	try {
		// Parse query parameters
		const limit = parseInt(url.searchParams.get('limit') || '10');
		const offset = parseInt(url.searchParams.get('offset') || '0');
		const status = url.searchParams.get('status') || 'published';
		const category = url.searchParams.get('category');
		const tag = url.searchParams.get('tag');
		const featured = url.searchParams.get('featured');
		const author = url.searchParams.get('author');
		const search = url.searchParams.get('search');

		// Filter posts based on parameters
		let filteredPosts = mockPosts.filter(post => {
			// Status filter
			if (status && post.status !== status) return false;
			
			// Category filter
			if (category && !post.categories.some(cat => cat.slug === category)) return false;
			
			// Tag filter
			if (tag && !post.tags.some(t => t.slug === tag)) return false;
			
			// Featured filter
			if (featured !== null && post.featured !== (featured === 'true')) return false;
			
			// Author filter
			if (author && post.author.id !== parseInt(author)) return false;
			
			// Search filter
			if (search) {
				const searchLower = search.toLowerCase();
				return post.title.toLowerCase().includes(searchLower) ||
					   post.excerpt.toLowerCase().includes(searchLower) ||
					   post.content.toLowerCase().includes(searchLower);
			}
			
			return true;
		});

		// Sort by publishedAt (newest first)
		filteredPosts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

		// Apply pagination
		const total = filteredPosts.length;
		const paginatedPosts = filteredPosts.slice(offset, offset + limit);

		// Calculate pagination info
		const hasMore = offset + limit < total;
		const totalPages = Math.ceil(total / limit);
		const currentPage = Math.floor(offset / limit) + 1;

		return json({
			success: true,
			posts: paginatedPosts,
			pagination: {
				total,
				limit,
				offset,
				hasMore,
				totalPages,
				currentPage
			},
			filters: {
				status,
				category,
				tag,
				featured,
				author,
				search
			}
		});
	} catch (error) {
		console.error('Error fetching posts:', error);
		return json({
			success: false,
			error: 'Internal server error',
			message: error.message
		}, { status: 500 });
	}
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const data = await request.json();
		
		// Validate required fields
		const requiredFields = ['title', 'content', 'authorId'];
		for (const field of requiredFields) {
			if (!data[field]) {
				return json({
					success: false,
					error: 'Validation error',
					message: `Field '${field}' is required`
				}, { status: 400 });
			}
		}

		// Create new post (in production, this would save to database)
		const newPost = {
			id: mockPosts.length + 1,
			title: data.title,
			slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
			excerpt: data.excerpt || data.content.substring(0, 200) + '...',
			content: data.content,
			publishedAt: data.publishedAt || new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			status: data.status || 'draft',
			featured: data.featured || false,
			author: {
				id: data.authorId,
				name: 'Coding Nguyễn', // In production, fetch from database
				email: 'coding@nguyen.dev',
				avatar: '/images/avatar.jpg'
			},
			categories: data.categories || [],
			tags: data.tags || [],
			readingTime: Math.ceil(data.content.split(' ').length / 200), // Estimate reading time
			viewCount: 0,
			thumbnail: data.thumbnail || '/images/posts/default.jpg',
			seo: data.seo || {
				metaTitle: data.title,
				metaDescription: data.excerpt || data.content.substring(0, 160),
				keywords: []
			}
		};

		// Add to mock data (in production, save to database)
		mockPosts.push(newPost);

		return json({
			success: true,
			post: newPost,
			message: 'Post created successfully'
		}, { status: 201 });
	} catch (error) {
		console.error('Error creating post:', error);
		return json({
			success: false,
			error: 'Internal server error',
			message: error.message
		}, { status: 500 });
	}
}

