import type { Metadata } from 'next'
import Landing from './Landing'

export const metadata: Metadata = {
  title: 'Mozhippattru — Japanese Language Center | JLPT N5–N3 Coaching',
  description:
    'Mozhippattru (மொழிப்பற்று) Japanese Language Center. Learn Japanese for JLPT N5, N4 & N3 — taught by N1-certified teachers, online & in-class. Book a free demo class today.',
}

export default function Home() {
  return <Landing />
}
