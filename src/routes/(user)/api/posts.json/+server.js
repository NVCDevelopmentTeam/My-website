import { postsPerPage } from '$lib/data/config';
import { fetchPosts } from '$lib/data/fetchPosts';
import { json, error } from '@sveltejs/kit';

// Rate limiting setup
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 30;
const requestLog = new Map();

// Simple cache implementation
const cache = new Map();
const CACHE_TTL = 300000; // 5 minutes

function checkRateLimit(ip) {
	const now = Date.now();
	const userRequests = requestLog.get(ip) || [];
	const recentRequests = userRequests.filter((time) => now - time < RATE_LIMIT_WINDOW);

	if (recentRequests.length >= MAX_REQUESTS) {
		return false;
	}

	requestLog.set(ip, [...recentRequests, now]);
	return true;
}

function getCacheKey(params) {
	return `posts-${JSON.stringify(params)}`;
}

/**
 * GET endpoint for fetching posts
 * Endpoint: /api/posts.json
 */
export const GET = async ({ url, request }) => {
	const startTime = performance.now();
	const clientIP = request.headers.get('x-forwarded-for') || 'unknown';

	try {
		// Rate limiting check
		if (!checkRateLimit(clientIP)) {
			error(429, 'Too many requests');
		}

		// Validate and parse query parameters
		const page = Math.max(1, parseInt(url.searchParams.get('page')) || 1);
		const category = url.searchParams.get('category')?.slice(0, 50);
		const tag = url.searchParams.get('tag')?.slice(0, 50);
		const search = url.searchParams.get('search')?.slice(0, 100);

		// Check cache
		const cacheKey = getCacheKey({ page, category, tag, search });
		const cached = cache.get(cacheKey);
		if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
			return json(cached.data, {
				headers: {
					'Cache-Control': 'public, max-age=300',
					'X-Cache': 'HIT',
					'X-Response-Time': `${Math.round(performance.now() - startTime)}ms`
				}
			});
		}

		// Build options object
		const options = {
			limit: postsPerPage,
			offset: (page - 1) * postsPerPage,
			...(category && { category }),
			...(tag && { tag }),
			...(search && { search })
		};

		// Fetch with timeout and abort controller
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 5000);

		const result = await fetchPosts(options);
		clearTimeout(timeout);

		const response = {
			posts: result.posts,
			total: result.total,
			page,
			postsPerPage,
			totalPages: Math.ceil(result.total / postsPerPage),
			hasNextPage: page * postsPerPage < result.total,
			hasPreviousPage: page > 1
		};

		// Update cache
		cache.set(cacheKey, {
			data: response,
			timestamp: Date.now()
		});

		return json(response, {
			headers: {
				'Cache-Control': 'public, max-age=300',
				'X-Cache': 'MISS',
				'X-Response-Time': `${Math.round(performance.now() - startTime)}ms`
			}
		});
	} catch (err) {
		console.error('API Error:', {
			path: url.pathname,
			query: Object.fromEntries(url.searchParams),
			ip: clientIP,
			error: err.message,
			stack: err.stack
		});

		const status = err.status || (err.name === 'AbortError' ? 504 : 500);

		error(status, err.message || 'Internal server error');
	}
};

/**
 * POST endpoint for creating posts (optional)
 * Uncomment and modify as needed
 */
/*
export const POST = async ({ request }) => {
    console.log('🚀 API Route: POST /api/posts.json called');
    
    try {
        const data = await request.json();
        
        // Validate required fields
        if (!data.title || !data.content) {
            throw error(400, 'Title and content are required');
        }

        // Process the post creation
        // const newPost = await createPost(data);
        
        return json({ success: true, post: newPost }, { status: 201 });
    } catch (err) {
        console.error('💥 Error creating post:', err);
        
        if (err.status) {
            throw err;
        } else {
            throw error(500, 'Failed to create post');
        }
    }
};
*/

/**
 * OPTIONS endpoint for CORS (if needed)
 */
export const OPTIONS = async () => {
	return new Response(null, {
		status: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization'
		}
	});
};
