import { siteTitle, siteDescription, siteURL, siteLink } from '$lib/data/config';

// This function will create a JSON object from an array of items
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

// This function will return a Response object with content type 'application/json'
export async function get() {
  // You need to generate the feed JSON object
  const items = []; // Replace this with your array of items
  const feed = generateFeed(items);

  // You need to convert the feed object into a JSON string
  const body = JSON.stringify(feed);

  // You need to set the content type to 'application/json'
  const headers = {
    'Content-Type': 'application/json',
  };

  // You need to return a Response object with body and headers parameters
  return {
    body,
    headers,
  };
}