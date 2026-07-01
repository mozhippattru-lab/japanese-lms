import type { MetadataRoute } from 'next'

const SITE_URL = 'https://mozhippattru.org'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // The public marketing site is a single page with in-page section anchors.
  // Listing the key sections helps search + answer engines understand structure.
  const sections = ['', '#courses', '#pricing', '#demo', '#donate', '#faq']

  return sections.map((hash, i) => ({
    url: `${SITE_URL}/${hash}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: i === 0 ? 1 : 0.7,
  }))
}
