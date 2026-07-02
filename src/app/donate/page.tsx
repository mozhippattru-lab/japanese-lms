import type { Metadata } from 'next'
import DonateClient from './DonateClient'

export const metadata: Metadata = {
  title: 'Wheelchair Donation — Support Our Electric Wheelchair Mission',
  description:
    'Support Mozhippattru’s Electric Wheelchair Donation Fund. 25% of every course fee — plus voluntary gifts from students, parents and supporters — helps people with disabilities regain independence and mobility.',
  alternates: { canonical: '/donate' },
}

export default function DonatePage() {
  return <DonateClient />
}
