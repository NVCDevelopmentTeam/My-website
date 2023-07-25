import { fetch, getResponse } from '@sveltejs/kit';

export async function search(query) {
  const response = await fetch(`https://example.com/api/search?q=${query}`);
  return getResponse(response);
}

export async function get({ query }) {
  const { q } = (query);

  // call the `search` function with the query parameter
  const searchQuery = JSON.stringify(q);
  const results = await search(searchQuery);
  
  // return the results in the response body
  return {
    body: results
  };
}