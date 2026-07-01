import type { MetadataRoute } from 'next'

const SITE_URL = 'https://mozhippattru.org'

export default function sitemap(): MetadataRoute.Sitemap {
  // Single-page marketing site — only the homepage is a real, indexable URL.
  // (Fragment anchors like /#pricing are not separate pages and Google ignores
  // them in sitemaps, so we don't list them.)
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
