import { json } from '@sveltejs/kit';

// Mock data for search - in production this would search across database
const mockSearchData = [
	{
		id: 1,
		title: 'Chào mừng đến với Coding Nguyễn',
		excerpt: 'Khám phá thế giới lập trình và accessibility cùng tôi.',
		url: '/blog/chao-mung-den-voi-coding-nguyen',
		type: 'post',
		category: 'Giới thiệu',
		publishedAt: new Date().toISOString(),
		author: 'Coding Nguyễn',
		tags: ['welcome', 'introduction'],
		searchableContent: 'chào mừng coding nguyễn lập trình accessibility web development'
	},
	{
		id: 2,
		title: 'Hướng dẫn Accessibility cho người mới bắt đầu',
		excerpt: 'Tìm hiểu các nguyên tắc cơ bản về khả năng truy cập web.',
		url: '/blog/huong-dan-accessibility-cho-nguoi-moi-bat-dau',
		type: 'post',
		category: 'A11y',
		publishedAt: new Date(Date.now() - 86400000).toISOString(),
		author: 'Coding Nguyễn',
		tags: ['accessibility', 'a11y', 'wcag'],
		searchableContent: 'accessibility a11y wcag screen reader khả năng truy cập web'
	},
	{
		id: 3,
		title: 'SvelteKit và TailwindCSS: Combo hoàn hảo',
		excerpt: 'Xây dựng ứng dụng web hiện đại với SvelteKit và TailwindCSS.',
		url: '/blog/sveltekit-va-tailwindcss-combo-hoan-hao',
		type: 'post',
		category: 'Web Development',
		publishedAt: new Date(Date.now() - 172800000).toISOString(),
		author: 'Coding Nguyễn',
		tags: ['sveltekit', 'tailwindcss', 'frontend'],
		searchableContent: 'sveltekit tailwindcss css framework frontend web development'
	},
	{
		id: 4,
		title: 'Giới thiệu về tôi',
		excerpt: 'Tìm hiểu về hành trình lập trình và passion về accessibility của tôi.',
		url: '/about',
		type: 'page',
		category: 'Trang tĩnh',
		publishedAt: new Date(Date.now() - 259200000).toISOString(),
		author: 'Coding Nguyễn',
		tags: ['about', 'biography'],
		searchableContent: 'giới thiệu about biography lập trình viên developer'
	},
	{
		id: 5,
		title: 'Liên hệ',
		excerpt: 'Thông tin liên hệ và cách thức kết nối với tôi.',
		url: '/contact',
		type: 'page',
		category: 'Trang tĩnh',
		publishedAt: new Date(Date.now() - 345600000).toISOString(),
		author: 'Coding Nguyễn',
		tags: ['contact', 'communication'],
		searchableContent: 'liên hệ contact email phone social media'
	},
	{
		id: 6,
		title: 'Tối ưu hóa Performance cho Website',
		excerpt: 'Các kỹ thuật và best practices để tối ưu hóa hiệu suất website.',
		url: '/blog/toi-uu-hoa-performance-cho-website',
		type: 'post',
		category: 'Performance',
		publishedAt: new Date(Date.now() - 432000000).toISOString(),
		author: 'Coding Nguyễn',
		tags: ['performance', 'optimization', 'speed'],
		searchableContent: 'performance optimization tối ưu hóa hiệu suất lazy loading'
	},
	{
		id: 7,
		title: 'Socket.io và Real-time Communication',
		excerpt: 'Xây dựng ứng dụng real-time với Socket.io.',
		url: '/blog/socketio-va-realtime-communication',
		type: 'post',
		category: 'Backend',
		publishedAt: new Date(Date.now() - 518400000).toISOString(),
		author: 'Coding Nguyễn',
		tags: ['socketio', 'websocket', 'realtime'],
		searchableContent: 'socket.io websocket real-time chat notification live updates'
	},
	{
		id: 8,
		title: 'Dự án của tôi',
		excerpt: 'Khám phá các dự án mã nguồn mở và ứng dụng tôi đã phát triển.',
		url: '/projects',
		type: 'page',
		category: 'Trang tĩnh',
		publishedAt: new Date(Date.now() - 604800000).toISOString(),
		author: 'Coding Nguyễn',
		tags: ['projects', 'portfolio', 'opensource'],
		searchableContent: 'dự án projects portfolio mã nguồn mở opensource github'
	}
];

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	try {
		// Parse query parameters
		const query = url.searchParams.get('q') || '';
		const limit = parseInt(url.searchParams.get('limit') || '10');
		const offset = parseInt(url.searchParams.get('offset') || '0');
		const type = url.searchParams.get('type'); // 'post', 'page', or null for all
		const category = url.searchParams.get('category');

		// If no query, return empty results
		if (!query.trim()) {
			return json({
				success: true,
				results: [],
				query: '',
				pagination: {
					total: 0,
					limit,
					offset,
					hasMore: false,
					totalPages: 0,
					currentPage: 1
				}
			});
		}

		const searchQuery = query.toLowerCase().trim();
		
		// Search algorithm
		let searchResults = mockSearchData.map(item => {
			let score = 0;
			const titleLower = item.title.toLowerCase();
			const excerptLower = item.excerpt.toLowerCase();
			const searchableContentLower = item.searchableContent.toLowerCase();
			
			// Title exact match (highest score)
			if (titleLower === searchQuery) {
				score += 100;
			}
			// Title contains query
			else if (titleLower.includes(searchQuery)) {
				score += 50;
			}
			// Title contains individual words
			else {
				const queryWords = searchQuery.split(' ');
				queryWords.forEach(word => {
					if (titleLower.includes(word)) {
						score += 20;
					}
				});
			}
			
			// Excerpt contains query
			if (excerptLower.includes(searchQuery)) {
				score += 30;
			}
			// Excerpt contains individual words
			else {
				const queryWords = searchQuery.split(' ');
				queryWords.forEach(word => {
					if (excerptLower.includes(word)) {
						score += 10;
					}
				});
			}
			
			// Searchable content contains query
			if (searchableContentLower.includes(searchQuery)) {
				score += 20;
			}
			// Searchable content contains individual words
			else {
				const queryWords = searchQuery.split(' ');
				queryWords.forEach(word => {
					if (searchableContentLower.includes(word)) {
						score += 5;
					}
				});
			}
			
			// Category match
			if (item.category.toLowerCase().includes(searchQuery)) {
				score += 15;
			}
			
			// Tags match
			item.tags.forEach(tag => {
				if (tag.toLowerCase().includes(searchQuery)) {
					score += 10;
				}
			});
			
			// Author match
			if (item.author.toLowerCase().includes(searchQuery)) {
				score += 5;
			}
			
			return { ...item, score };
		});

		// Filter by minimum score and type
		searchResults = searchResults.filter(item => {
			if (item.score <= 0) return false;
			if (type && item.type !== type) return false;
			if (category && item.category.toLowerCase() !== category.toLowerCase()) return false;
			return true;
		});

		// Sort by score (highest first), then by date (newest first)
		searchResults.sort((a, b) => {
			if (b.score !== a.score) {
				return b.score - a.score;
			}
			return new Date(b.publishedAt) - new Date(a.publishedAt);
		});

		// Apply pagination
		const total = searchResults.length;
		const paginatedResults = searchResults.slice(offset, offset + limit);

		// Remove score from final results (internal use only)
		const finalResults = paginatedResults.map(({ score, searchableContent, ...item }) => item);

		// Calculate pagination info
		const hasMore = offset + limit < total;
		const totalPages = Math.ceil(total / limit);
		const currentPage = Math.floor(offset / limit) + 1;

		// Add search suggestions if no results found
		let suggestions = [];
		if (total === 0) {
			// Generate suggestions based on available content
			const allWords = mockSearchData.flatMap(item => 
				item.searchableContent.split(' ')
			);
			const uniqueWords = [...new Set(allWords)];
			
			suggestions = uniqueWords
				.filter(word => word.length > 3 && word.includes(searchQuery.substring(0, 3)))
				.slice(0, 5);
		}

		return json({
			success: true,
			results: finalResults,
			query: searchQuery,
			suggestions,
			pagination: {
				total,
				limit,
				offset,
				hasMore,
				totalPages,
				currentPage
			},
			filters: {
				type,
				category
			}
		});
	} catch (error) {
		console.error('Error performing search:', error);
		return json({
			success: false,
			error: 'Internal server error',
			message: error.message,
			results: [],
			query: url.searchParams.get('q') || ''
		}, { status: 500 });
	}
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const data = await request.json();
		
		// Advanced search with filters
		const {
			query = '',
			filters = {},
			sort = 'relevance', // 'relevance', 'date', 'title'
			limit = 10,
			offset = 0
		} = data;

		// Validate input
		if (!query.trim()) {
			return json({
				success: false,
				error: 'Validation error',
				message: 'Search query is required'
			}, { status: 400 });
		}

		// Perform search with advanced filters
		// This would be more sophisticated in production with full-text search
		let searchResults = mockSearchData.filter(item => {
			const searchQuery = query.toLowerCase();
			const matchesQuery = 
				item.title.toLowerCase().includes(searchQuery) ||
				item.excerpt.toLowerCase().includes(searchQuery) ||
				item.searchableContent.toLowerCase().includes(searchQuery);
			
			if (!matchesQuery) return false;
			
			// Apply filters
			if (filters.type && item.type !== filters.type) return false;
			if (filters.category && item.category !== filters.category) return false;
			if (filters.author && item.author !== filters.author) return false;
			if (filters.dateFrom && new Date(item.publishedAt) < new Date(filters.dateFrom)) return false;
			if (filters.dateTo && new Date(item.publishedAt) > new Date(filters.dateTo)) return false;
			if (filters.tags && filters.tags.length > 0) {
				const hasMatchingTag = filters.tags.some(tag => 
					item.tags.includes(tag)
				);
				if (!hasMatchingTag) return false;
			}
			
			return true;
		});

		// Apply sorting
		switch (sort) {
			case 'date':
				searchResults.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
				break;
			case 'title':
				searchResults.sort((a, b) => a.title.localeCompare(b.title));
				break;
			case 'relevance':
			default:
				// Already sorted by relevance in GET method logic
				break;
		}

		// Apply pagination
		const total = searchResults.length;
		const paginatedResults = searchResults.slice(offset, offset + limit);

		return json({
			success: true,
			results: paginatedResults,
			query,
			filters,
			sort,
			pagination: {
				total,
				limit,
				offset,
				hasMore: offset + limit < total,
				totalPages: Math.ceil(total / limit),
				currentPage: Math.floor(offset / limit) + 1
			}
		});
	} catch (error) {
		console.error('Error performing advanced search:', error);
		return json({
			success: false,
			error: 'Internal server error',
			message: error.message
		}, { status: 500 });
	}
}

