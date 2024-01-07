import { siteTitle, siteDescription, siteURL, siteLink } from '$lib/data/config'

// This function will create an XML string from an array of items
const xml = (items) => `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${siteTitle}</title>
    <description>${siteDescription}</description>
    <link>${siteURL}</link>
    <author>${siteLink}</author>
    ${items.map(item => `
    <item>
      <title>${item.title}</title>
      <description>${item.description}</description>
      <link>${item.link}</link>
      <guid>${item.guid}</guid>
      <pubDate>${item.pubDate}</pubDate>
    </item>
    `).join('')}
  </channel>
</rss>`

// This function will return a Response object with content type 'application/xml'
export async function get() {
  // You need to get the items from some source, for example an API or a JSON file
  // Here I assume you have a JSON file named items.json in the $lib/data directory
  import items from '$lib/data/items.json'

  // You need to convert the items into XML format
  const body = xml(items)

  // You need to set the content type to 'application/xml'
  const headers = {
    'Content-Type': 'application/xml'
  }

  // You need to return a Response object with body and headers parameters
  return new Response(body, { headers })
}