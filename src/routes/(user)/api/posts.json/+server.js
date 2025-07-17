import { postsPerPage } from '$lib/data/config';
import { fetchPosts } from '$lib/data/fetchPosts';
import { json, error } from '@sveltejs/kit';

// Remove prerender for dynamic API routes
// export const prerender = true;

/**
 * GET endpoint for fetching posts
 * Endpoint: /api/posts.json
 */
export const GET = async ({ url, request }) => {
    console.log('🚀 API Route: GET /api/posts.json called');
    
    try {
        // Validate postsPerPage configuration
        if (!postsPerPage || typeof postsPerPage !== 'number' || postsPerPage <= 0) {
            console.error('❌ Invalid postsPerPage configuration:', postsPerPage);
            throw error(500, 'Invalid posts per page configuration');
        }

        console.log('📊 Posts per page:', postsPerPage);

        // Parse query parameters for additional options
        const searchParams = url.searchParams;
        const page = parseInt(searchParams.get('page')) || 1;
        const category = searchParams.get('category');
        const tag = searchParams.get('tag');
        const search = searchParams.get('search');

        // Build options object
        const options = {
            limit: postsPerPage,
            offset: (page - 1) * postsPerPage,
            ...(category && { category }),
            ...(tag && { tag }),
            ...(search && { search })
        };

        console.log('🔧 Fetch options:', options);

        // Validate fetchPosts function exists
        if (typeof fetchPosts !== 'function') {
            console.error('❌ fetchPosts is not a function');
            throw error(500, 'fetchPosts function not available');
        }

        // Fetch posts with timeout
        const fetchPromise = fetchPosts(options);
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout')), 10000); // 10 second timeout
        });

        const result = await Promise.race([fetchPromise, timeoutPromise]);
        
        console.log('📝 fetchPosts result type:', typeof result);
        console.log('📝 fetchPosts result keys:', result ? Object.keys(result) : 'null');

        // Validate result structure
        if (!result || typeof result !== 'object') {
            console.error('❌ Invalid result from fetchPosts:', result);
            throw error(500, 'Invalid response from fetchPosts');
        }

        const { posts, total } = result;

        // Validate posts data
        if (!Array.isArray(posts)) {
            console.error('❌ Posts is not an array:', posts);
            throw error(500, 'Invalid posts data structure');
        }

        // Validate total count
        if (typeof total !== 'number' || total < 0) {
            console.error('❌ Invalid total count:', total);
            throw error(500, 'Invalid total count');
        }

        console.log('✅ Successfully fetched posts:', {
            postsCount: posts.length,
            total,
            page,
            hasNextPage: (page * postsPerPage) < total
        });

        // Add pagination metadata
        const response = {
            posts,
            total,
            page,
            postsPerPage,
            totalPages: Math.ceil(total / postsPerPage),
            hasNextPage: (page * postsPerPage) < total,
            hasPreviousPage: page > 1
        };

        // Set appropriate cache headers
        const headers = {
            'Cache-Control': 'public, max-age=300', // 5 minutes cache
            'Content-Type': 'application/json'
        };

        return json(response, { headers });

    } catch (err) {
        console.error('💥 Error in API route:', err);
        
        // Log detailed error information
        console.error('Error details:', {
            name: err.name,
            message: err.message,
            stack: err.stack,
            cause: err.cause
        });

        // Return appropriate error response
        if (err.status) {
            // Already a SvelteKit error
            throw err;
        } else if (err.message === 'Request timeout') {
            throw error(504, 'Request timeout - please try again');
        } else {
            throw error(500, 'Internal server error while fetching posts');
        }
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