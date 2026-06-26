import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['nodemailer'],
  // Lets CI build into a temp dir (.next-new) so the live .next keeps serving
  // during the build; the deploy then swaps it in. Defaults to .next at runtime.
  distDir: process.env.NEXT_DIST_DIR || '.next',
};

export default nextConfig;
