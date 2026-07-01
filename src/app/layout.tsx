import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://mozhippattru.org";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mozhippattru — Japanese Language School | JLPT N5–N3 Coaching",
    template: "%s | Mozhippattru Japanese Language School",
  },
  description:
    "Mozhippattru (மொழிப்பற்று) Japanese Language School. Learn Japanese for JLPT N5, N4 & N3 — taught by N1-certified teachers, online & across India. Book a free demo class today.",
  applicationName: "Mozhippattru Japanese Language School",
  keywords: [
    "Japanese language school",
    "JLPT coaching",
    "JLPT N5",
    "JLPT N4",
    "JLPT N3",
    "learn Japanese online",
    "Japanese classes Tamil Nadu",
    "Japanese classes Namakkal",
    "Japanese coaching India",
    "N1 certified Japanese teachers",
    "Mozhippattru",
    "மொழிப்பற்று",
    "日本語学校",
    "Japanese for Tamil speakers",
  ],
  authors: [{ name: "Mozhippattru Japanese Language School" }],
  creator: "Mozhippattru Japanese Language School",
  publisher: "Mozhippattru Japanese Language School",
  category: "education",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Mozhippattru Japanese Language School",
    title: "Mozhippattru — Japanese Language School | JLPT N5–N3 Coaching",
    description:
      "Learn Japanese for JLPT N5, N4 & N3 with N1-certified teachers. Online & across India. Book a free demo class.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mozhippattru — Japanese Language School | JLPT N5–N3",
    description:
      "Learn Japanese for JLPT N5, N4 & N3 with N1-certified teachers. Online & across India. Book a free demo class.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/12.png", type: "image/png" }],
    apple: [{ url: "/12.png" }],
  },
  manifest: "/manifest.webmanifest",
  formatDetection: { telephone: true, email: true, address: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
