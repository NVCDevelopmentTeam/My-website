import { siteTitle, siteDescription, siteURL, siteLink } from '$lib/data/config'

export async function get() {
  const data = await Promise.all(
    Object.entries(import.meta.glob('$lib/posts/*.md')).map(async ([path, page]) => {
      const { metadata } = await page()
      const slug = path.split('/').pop().split('.').shift()
      return { ...metadata, slug }
    })
  )

  const posts = data.sort((a, b) => new Date(b.date) - new Date(a.date))

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