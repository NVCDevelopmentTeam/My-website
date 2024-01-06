import database from '$lib/data/database';

export async function load({ params }) {
  // get data from database by id
  const data = await database.get(params.id);

  // check if data exists
  if (data) {
    // returns data as JSON
    return {
      status: 200,
      body: data
    };
  } else {
    // returns error 404 if data not found
    return {
      status: 404,
      body: {
        message: 'No data found'
      }
    };
  }
}