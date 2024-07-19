import database from '$lib/data/database';
import { siteTitle, siteDescription, siteURL, siteLink } from '$lib/data/config';

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
