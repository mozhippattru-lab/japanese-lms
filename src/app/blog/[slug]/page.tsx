import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublishedPost, getPublishedPosts, getRelatedPosts } from '@/lib/blog'

export const revalidate = 60

const SITE = 'https://mozhippattru.org'

export async function generateStaticParams() {
  try {
    const posts = await getPublishedPosts()
    return posts.map(p => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedPost(slug).catch(() => null)
  if (!post) return { title: 'Article not found' }
  const title = post.meta_title || post.title
  const description = post.meta_description || post.excerpt || undefined
  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `${SITE}/blog/${post.slug}`,
      images: post.cover_image ? [post.cover_image] : undefined,
      publishedTime: post.published_at || undefined,
    },
    twitter: { card: 'summary_large_image', title, description, images: post.cover_image ? [post.cover_image] : undefined },
  }
}

function fmt(d: string | null) {
  return d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPublishedPost(slug).catch(() => null)
  if (!post) notFound()

  const related = await getRelatedPosts(post.slug, post.tags || []).catch(() => [])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta_description || post.excerpt || undefined,
    image: post.cover_image || `${SITE}/opengraph-image`,
    datePublished: post.published_at || undefined,
    dateModified: post.updated_at || post.published_at || undefined,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/blog/${post.slug}` },
    author: { '@type': 'Organization', name: 'Mozhippattru Japanese Language School' },
    publisher: {
      '@type': 'Organization',
      name: 'Mozhippattru Japanese Language School',
      logo: { '@type': 'ImageObject', url: `${SITE}/12.png` },
    },
  }

  return (
    <main style={{ fontFamily: 'Inter, sans-serif', background: '#fff', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article style={{ maxWidth: '740px', margin: '0 auto', padding: '48px 24px 90px' }}>
        <Link href="/blog" style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none', fontWeight: 600 }}>← Blog</Link>

        {post.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '22px 0 10px' }}>
            {post.tags.map(t => <span key={t} style={{ fontSize: '11px', fontWeight: 700, color: '#c2974b', background: '#f6efe0', padding: '2px 9px', borderRadius: '20px' }}>{t}</span>)}
          </div>
        )}
        <h1 style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 'clamp(28px,5vw,40px)', fontWeight: 700, color: '#1a1f3c', margin: '10px 0 10px', letterSpacing: '-0.02em', lineHeight: 1.15 }}>{post.title}</h1>
        <p style={{ fontSize: '13px', color: '#a39e93', margin: '0 0 28px' }}>{fmt(post.published_at)} · Mozhippattru Japanese Language School</p>

        {post.cover_image && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={post.cover_image} alt="" style={{ width: '100%', borderRadius: '14px', marginBottom: '28px' }} />
        )}

        <div
          className="blog-body"
          dangerouslySetInnerHTML={{ __html: post.body_html || '' }}
        />

        {/* Conversion CTA */}
        <div style={{ marginTop: '44px', background: 'linear-gradient(135deg,#1a1f3c 0%,#2d3461 100%)', borderRadius: '16px', padding: '30px 32px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Ready to learn Japanese?</div>
          <p style={{ fontSize: '14.5px', color: 'rgba(255,255,255,0.75)', margin: '0 auto 20px', maxWidth: '460px', lineHeight: 1.6 }}>
            Join Mozhippattru Japanese Language School — JLPT N5–N3 with N1-certified teachers. Book a <strong>free demo class</strong>, no commitment.
          </p>
          <a href="/#demo" style={{ display: 'inline-block', background: '#e84040', color: '#fff', textDecoration: 'none', padding: '13px 30px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, boxShadow: '0 8px 22px rgba(232,64,64,0.3)' }}>Book a Free Demo →</a>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div style={{ marginTop: '48px' }}>
            <h2 style={{ fontFamily: "'Shippori Mincho', serif", fontSize: '20px', fontWeight: 700, color: '#1a1f3c', margin: '0 0 16px' }}>Continue reading</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {related.map(r => (
                <Link key={r.id} href={`/blog/${r.slug}`} style={{ textDecoration: 'none', display: 'block', border: '1px solid rgba(40,32,20,0.1)', borderRadius: '12px', padding: '16px 18px' }}>
                  <div style={{ fontSize: '15.5px', fontWeight: 700, color: '#1a1f3c', marginBottom: '4px' }}>{r.title}</div>
                  {r.excerpt && <div style={{ fontSize: '13.5px', color: '#6b665e', lineHeight: 1.5 }}>{r.excerpt}</div>}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Developer credit */}
        <p style={{ marginTop: '48px', paddingTop: '20px', borderTop: '1px solid rgba(40,32,20,0.1)', textAlign: 'center', fontSize: '13px', color: '#8a90a8' }}>
          Developed &amp; maintained by{' '}
          <a href="https://nexaex.in" target="_blank" rel="noopener" style={{ color: '#2d3461', fontWeight: 600, textDecoration: 'none' }}>Nexaex Digital Services Pvt. Ltd.</a>
        </p>
      </article>

      <style>{`
        .blog-body { font-size: 17px; line-height: 1.8; color: #2a2724; }
        .blog-body h2 { font-family: 'Shippori Mincho', serif; font-size: 26px; font-weight: 700; margin: 32px 0 12px; color: #1a1f3c; }
        .blog-body h3 { font-size: 20px; font-weight: 700; margin: 24px 0 10px; color: #1a1f3c; }
        .blog-body p { margin: 0 0 18px; }
        .blog-body ul, .blog-body ol { margin: 0 0 18px 24px; }
        .blog-body li { margin-bottom: 6px; }
        .blog-body blockquote { border-left: 3px solid #e84040; margin: 20px 0; padding: 6px 18px; color: #6b665e; font-style: italic; }
        .blog-body a { color: #2d7dd2; text-decoration: underline; }
        .blog-body img { max-width: 100%; border-radius: 10px; }
      `}</style>
    </main>
  )
}
