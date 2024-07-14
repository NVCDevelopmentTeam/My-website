import { siteTitle, siteDescription, siteURL, siteLink } from '$lib/data/config';
import database from '$lib/data/database';

const generateFeed = (items) => {
  return {
    title: siteTitle,
    description: siteDescription,
    link: siteURL,
    author: siteLink,
    items: items.map((item) => ({
      title: item.title,
      description: item.description,
      link: item.link,
      guid: item.guid,
      pubDate: item.pubDate,
    })),
  };
};

// GET /api/feed.json
export async function GET() {
  const comments = database.getComments();
  const feed = generateFeed(comments);

  return new Response(JSON.stringify(feed), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
