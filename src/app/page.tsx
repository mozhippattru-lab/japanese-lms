import type { Metadata } from 'next'
import Landing from './Landing'
import { buildJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Mozhippattru — Japanese Language School | JLPT N5–N3 Coaching',
  description:
    'Mozhippattru (மொழிப்பற்று) Japanese Language School. Learn Japanese for JLPT N5, N4 & N3 — taught by N1-certified teachers, online & across India. Book a free demo class today.',
  alternates: { canonical: '/' },
}

export default function Home() {
  const jsonLd = buildJsonLd()
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Landing />
    </>
  )
}
