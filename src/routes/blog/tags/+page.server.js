import fetchPosts from '$lib/data/fetchPosts'
import { postsPerPage } from '$lib/data/config'
// TODO: this should be a `load` function
/*
export async function get() {
  // Perform some server-side logic here
  const data = await fetchDataFromDatabase();

  // Return the data as a response
  return {
    body: { data },
    headers: {
      'Content-Type': 'application/json'
    }
  };
}

async function fetchDataFromDatabase() {
  // Simulate fetching data from a database
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = ['apple', 'banana', 'cherry'];
      resolve(data);
    }, 1000);
  });
}
*/