import type { MetadataRoute } from 'next'
import { getPublishedPosts } from '@/lib/blog'

const SITE_URL = 'https://mozhippattru.org'

export const revalidate = 300

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/donate`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  try {
    const posts = await getPublishedPosts()
    for (const p of posts) {
      entries.push({
        url: `${SITE_URL}/blog/${p.slug}`,
        lastModified: new Date(p.updated_at || p.published_at || Date.now()),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  } catch {
    /* posts table may not exist yet — ignore */
  }

  return entries
}
