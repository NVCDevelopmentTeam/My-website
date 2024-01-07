import { fetch, getResponse } from '@sveltejs/kit';

export async function search(query) {
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(`https://example.com/api/search?q=${encodedQuery}`);
    
    // Validate response before returning
    if (!response.ok) {
      throw new Error('Search API responded with an error');
    }

    return getResponse(response);
  } catch (error) {
    console.error('Error during search:', error);
    throw error; // Re-throw to be handled in the calling function
  }
}

export async function get({ query }) {
  const { q } = query;

  if (q && typeof q === 'string' && q.trim() !== '') {
    try {
      const results = await search(q);
      return {
        body: results
      };
    } catch (error) {
      console.error('Error in get function:', error);
      return {
        status: 500,
        body: 'Internal Server Error'
      };
    }
  } else {
    return {
      status: 400,
      body: 'Invalid query parameter'
    };
  }
}
