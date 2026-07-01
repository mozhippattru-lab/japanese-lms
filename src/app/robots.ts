import type { MetadataRoute } from 'next'

const SITE_URL = 'https://mozhippattru.org'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Keep private app areas out of the index
        disallow: ['/dashboard/', '/api/', '/login', '/register', '/reset-password', '/forgot-password', '/blocked'],
      },
      // Explicitly welcome answer-engine / AI crawlers (AEO)
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Applebot', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
