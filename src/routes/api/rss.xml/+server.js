// src/routes/api/sitemap.xml/server.js
import { siteTitle, siteDescription, siteURL, siteLink } from '$lib/data/config'

export function get () {
  // Do dynamc fetching or computing here
  const data = await Promise.all(
    Object.entries(import.meta.glob('$lib/posts/*.md')).map(async ([path, page]) => {
      const { metadata } = await page()
      const slug = path.split('/').pop().split('.').shift()
      return { ...metadata, slug }
    })
  )
  .then(posts => {
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
  })

  return {
    body: {
      siteTitle,
      siteDescription,
      siteURL,
      siteLink,
      posts
    }
  }
}
