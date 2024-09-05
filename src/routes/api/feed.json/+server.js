import { getComments } from '$lib/data/database'; // Correctly import getComments
import { siteTitle, siteDescription, siteURL, siteLink } from '$lib/data/config';

const generateFeed = (items) => {
  return {
    title: siteTitle,
    description: siteDescription,
    link: siteURL,
    author: siteLink,
    items: items.map((item) => ({
      title: item.name, // Adjust field names as necessary
      description: item.message, // Adjust field names as necessary
      link: item.link || '', // Provide a default value if link is missing
      guid: item.id, // Use a unique identifier if available
      pubDate: item.created_at, // Use the appropriate date field
    })),
  };
};

export async function GET() {
  try {
    // Fetch comments from the database
    const comments = await getComments();
    // Generate the feed
    const feed = generateFeed(comments);

    return new Response(JSON.stringify(feed), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    // Handle errors during fetch
    return new Response(JSON.stringify({ error: 'Failed to generate feed' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
