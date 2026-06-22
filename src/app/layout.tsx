import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "日本語センター — Japanese Language Center",
  description: "JLPT Learning Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
