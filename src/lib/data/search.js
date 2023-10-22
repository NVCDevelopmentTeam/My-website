import { fetch, getResponse } from '@sveltejs/kit';

export async function search(query) {
  // encode the query parameter to prevent errors
  const encodedQuery = encodeURIComponent(query);
  const response = await fetch(`https://example.com/api/search?q=${encodedQuery}`);
  return getResponse(response);
}

export async function get({ query }) {
  const { q } = query;

  // check if the query parameter is valid
  if (q && typeof q === 'string') {
    // call the `search` function with the query parameter
    const results = await search(q);

    // return the results in the response body
    return {
      body: results
    };
  } else {
    // return an error message if the query parameter is missing or invalid
    return {
      status: 400,
      body: 'Invalid query parameter'
    };
  }
}
