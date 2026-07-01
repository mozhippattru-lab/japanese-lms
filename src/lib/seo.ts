// Central SEO/AEO data — shared between the JSON-LD structured data (page.tsx)
// and the visible FAQ section (Landing.tsx) so they never drift apart.

export const SITE_URL = 'https://mozhippattru.org'

export const ORG = {
  name: 'Mozhippattru Japanese Language School',
  alternateName: 'மொழிப்பற்று ஜப்பானிய மொழிப் பள்ளிக்கூடம்',
  legalName: 'Mozhippattru Japanese Language School',
  telephone: '+91-90928-82957',
  email: 'japanese.school@mozhippattru.org',
  addressLocality: 'Pallipalayam',
  addressRegion: 'Tamil Nadu',
  addressArea: 'Namakkal',
  postalCountry: 'IN',
  areaServed: 'India',
  // Locality-level coordinates for Pallipalayam (Namakkal district).
  // Refine to the exact building pin once the Google Business Profile is live.
  latitude: 11.362,
  longitude: 77.729,
}

// The courses shown on the marketing site (prices inclusive of GST, excl. books).
export const SEO_COURSES = [
  { level: 'N5', name: 'JLPT N5 — Beginner Foundation', price: 9500, hours: 150 },
  { level: 'N4', name: 'JLPT N4 — Elementary', price: 11500, hours: 150 },
  { level: 'N3', name: 'JLPT N3 — Intermediate Bridge', price: 17000, hours: 300 },
]

// Visible FAQ — also emitted as FAQPage JSON-LD for answer engines.
export const FAQ: { q: string; a: string }[] = [
  {
    q: 'What JLPT levels does Mozhippattru teach?',
    a: 'We offer JLPT N5, N4 and N3 Japanese language courses, plus a beginner-friendly course for children (ages 10–15). Advanced N2 and N1 batches are on our roadmap.',
  },
  {
    q: 'Are the Japanese classes online or in-person?',
    a: 'All our JLPT courses are conducted online and are available across India (Pan India). In-person / in-class options are also available — the pricing differs, so please enquire for details.',
  },
  {
    q: 'Who teaches the classes?',
    a: 'Our courses are led by N1-certified Japanese teachers who have completed the JLPT path themselves. From July 2027, JLPT N3 will be taught by a native Japanese teacher.',
  },
  {
    q: 'How much do the Japanese courses cost?',
    a: 'Online course fees are: JLPT N5 ₹9,500, JLPT N4 ₹11,500 and JLPT N3 ₹17,000. All three levels together (the complete package) cost ₹35,000. All prices are inclusive of GST and exclude book fees.',
  },
  {
    q: 'Is there a free demo or trial class?',
    a: 'Yes. We offer a completely free online demo class with an N1-certified teacher — no fees and no commitment. You can book it from our website.',
  },
  {
    q: 'What is the medium of instruction?',
    a: 'JLPT N5 is taught in Tamil / English along with Japanese; JLPT N4 is taught in Japanese; and JLPT N3 is taught in Japanese by a native Japanese teacher. We do not teach in Tanglish or Japanglish — clear language is important to us.',
  },
  {
    q: 'How long is each JLPT course?',
    a: 'JLPT N5 runs for 150 hours, JLPT N4 for 150 hours and JLPT N3 for 300 hours — 600 hours in total for the complete N5–N3 package.',
  },
  {
    q: 'How do I enrol or contact the school?',
    a: 'You can book a free demo on our website, or reach us on phone/WhatsApp at +91 90928 82957 or by email at japanese.school@mozhippattru.org.',
  },
]

// Build the full JSON-LD @graph for the homepage.
export function buildJsonLd() {
  const org = {
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    '@id': `${SITE_URL}/#organization`,
    name: ORG.name,
    alternateName: ORG.alternateName,
    url: SITE_URL,
    logo: `${SITE_URL}/12.png`,
    image: `${SITE_URL}/opengraph-image`,
    description:
      'Mozhippattru Japanese Language School offers JLPT N5, N4 and N3 coaching by N1-certified teachers, online and across India.',
    telephone: ORG.telephone,
    email: ORG.email,
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      addressLocality: ORG.addressLocality,
      addressRegion: ORG.addressRegion,
      addressCountry: ORG.postalCountry,
    },
    // Locality-level coordinates for Pallipalayam, Namakkal (refine to the
    // exact building/Google Business pin when available).
    geo: {
      '@type': 'GeoCoordinates',
      latitude: ORG.latitude,
      longitude: ORG.longitude,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${ORG.latitude},${ORG.longitude}`,
    areaServed: { '@type': 'Country', name: ORG.areaServed },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: ORG.telephone,
      email: ORG.email,
      contactType: 'admissions',
      availableLanguage: ['Tamil', 'English', 'Japanese'],
    },
  }

  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: ORG.name,
    inLanguage: 'en',
    publisher: { '@id': `${SITE_URL}/#organization` },
  }

  const courses = SEO_COURSES.map((c) => ({
    '@type': 'Course',
    name: c.name,
    description: `${c.hours}-hour ${c.level} Japanese course preparing students for the JLPT ${c.level} examination.`,
    provider: { '@id': `${SITE_URL}/#organization` },
    inLanguage: ['ta', 'en', 'ja'],
    offers: {
      '@type': 'Offer',
      category: 'Tuition',
      price: c.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: `PT${c.hours}H`,
    },
  }))

  const faqPage = {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/#faq`,
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [org, website, ...courses, faqPage],
  }
}
