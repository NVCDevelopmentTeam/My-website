/**
 * All of these values are used throughout the site – for example, 
 * in the <meta> tags, in the footer, and in the RSS feed.
 * 
 * PLEASE BE SURE TO UPDATE THEM ALL! Thank you!
 **/

export const siteTitle = 'Coding Nguyễn'
export const siteDescription = 'Built with the SvelteKit Static Blog Starter'
export const siteURL = 'example.com'
export const siteLink = 'https://github.com/josh-collinsworth/sveltekit-blog-starter'
export const siteAuthor = '- Coding Nguyễn all rights reserved'

// Controls how many posts are shown per page on the main blog index pages
export const postsPerPage = 10

// Social media links
export const linkedin = 'your-linkedin-username'
export const instagram = 'your-instagram-username'
export const twitter = 'your-twitter-username'
export const github = 'your-github-username'

// Edit this to alter the main nav menu. (Also used by the footer and mobile nav.)
export const navItems = [
  {
    title: 'Blog',
    route: '/blog'
  }, {
    title: 'About',
    route: '/about'
  }, {
    title: 'Contact',
    route: '/contact'
  },
]
