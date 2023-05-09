export async function search(query) {
  const response = await fetch(`https://example.com/api/search?q=${query}`);
  const data = await response.json();
  return data.results;
}

export async function get({ query }) {
  const { q: searchQuery } = query;

  // call the `search` function with the query parameter
  const results = await search(searchQuery);
  
  // return the results in the response body
  return {
    body: results
  };
}
