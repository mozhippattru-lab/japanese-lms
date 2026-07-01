import type { Metadata } from 'next'
import Link from 'next/link'
import { getPublishedPosts, type Post } from '@/lib/blog'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Blog — Japanese Learning Tips & JLPT Guides',
  description:
    'Articles on learning Japanese, JLPT N5–N3 preparation, grammar, vocabulary and study tips from Mozhippattru Japanese Language School.',
  alternates: { canonical: '/blog' },
  openGraph: { type: 'website', title: 'Mozhippattru Blog — Japanese Learning & JLPT Guides', url: 'https://mozhippattru.org/blog' },
}

function fmt(d: string | null) {
  return d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''
}

export default async function BlogIndex() {
  let posts: Post[] = []
  try { posts = await getPublishedPosts() } catch { posts = [] }

  return (
    <main style={{ fontFamily: 'Inter, sans-serif', background: 'linear-gradient(180deg,#f6f1e7 0%,#fcfaf4 100%)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '56px 24px 80px' }}>
        <Link href="/" style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none', fontWeight: 600 }}>← Mozhippattru</Link>
        <h1 style={{ fontFamily: "'Shippori Mincho', serif", fontSize: '38px', fontWeight: 700, color: '#1a1f3c', margin: '18px 0 6px', letterSpacing: '-0.02em' }}>Blog</h1>
        <p style={{ fontSize: '16px', color: '#6b665e', margin: '0 0 40px' }}>Tips and guides for learning Japanese and clearing the JLPT.</p>

        {posts.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: '15px' }}>No articles published yet — check back soon.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {posts.map(p => (
              <Link key={p.id} href={`/blog/${p.slug}`} style={{ textDecoration: 'none', display: 'block', background: '#fff', border: '1px solid rgba(40,32,20,0.10)', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(40,32,20,0.04)' }}>
                {p.cover_image && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={p.cover_image} alt="" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                )}
                <div style={{ padding: '20px 24px' }}>
                  {p.tags?.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      {p.tags.slice(0, 3).map(t => <span key={t} style={{ fontSize: '11px', fontWeight: 700, color: '#c2974b', background: '#f6efe0', padding: '2px 9px', borderRadius: '20px' }}>{t}</span>)}
                    </div>
                  )}
                  <h2 style={{ fontFamily: "'Shippori Mincho', serif", fontSize: '22px', fontWeight: 700, color: '#1a1f3c', margin: '0 0 6px', letterSpacing: '-0.01em' }}>{p.title}</h2>
                  {p.excerpt && <p style={{ fontSize: '14.5px', color: '#6b665e', lineHeight: 1.6, margin: '0 0 10px' }}>{p.excerpt}</p>}
                  <span style={{ fontSize: '12.5px', color: '#a39e93' }}>{fmt(p.published_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
