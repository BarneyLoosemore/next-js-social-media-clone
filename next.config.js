/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    images: {
      allowFutureImage: true,
    },
  },
};

if (!process.env.NEXTAUTH_URL) {
  console.warn(
    "\x1b[33mwarn",
    "\x1b[0m",
    "NEXTAUTH_URL environment variable is not set."
  );
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    process.env.NEXTAUTH_URL = process.env.NEXT_PUBLIC_VERCEL_URL;
    console.warn(
      "\x1b[33mwarn",
      "\x1b[0m",
      `NEXTAUTH_URL environment variable is not set. Using Netlify URL ${process.env.URL}.`
    );
  }
}

module.exports = nextConfig;
