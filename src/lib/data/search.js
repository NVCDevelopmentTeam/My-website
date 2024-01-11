// We might consider importing fetch from '@sveltejs/kit' if we're in a server environment
import { fetch } from '@sveltejs/kit'; // Only import if needed

// The search function seems pretty robust, just need to ensure proper encoding
export async function search(query) {
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(`https://example.com/api/search?q=${encodedQuery}`);

    if (!response.ok) {
      throw new Error('Search API responded with an error');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error during search:', error.message);
    throw new Error('Search failed');
  }
}

// The get function receives an object with a 'url' property that includes the query parameters
export async function get({ url }) {
  // Utilize URLSearchParams for robust query string parsing
  const q = url.searchParams.get('q');

  // Ensure q exists and is not just white space
  if (q?.trim()) {
    try {
      const results = await search(q);
      return {
        status: 200,
        body: results
      };
    } catch (error) {
      console.error('Error in get function:', error.message);
      return {
        status: 500,
        body: 'Internal Server Error'
      };
    }
  } else {
    // For an invalid query, clue in the user with the correct status code and message
    return {
      status: 400,
      body: 'Invalid query parameter'
    };
  }
}