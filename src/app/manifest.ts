import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mozhippattru Japanese Language School',
    short_name: 'Mozhippattru',
    description:
      'Learn Japanese for JLPT N5, N4 & N3 with N1-certified teachers. Online & across India.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f6f1e7',
    theme_color: '#e84040',
    lang: 'en',
    categories: ['education'],
    icons: [
      { src: '/app-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/app-icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    ],
  }
}
