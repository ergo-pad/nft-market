/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL,
    ERGOPAD_API: process.env.ERGOPAD_API,
  },
  images: {
    domains: ['ergopad-public.s3.us-west-2.amazonaws.com', 'cloudflare-ipfs.com'],
  },
  swcMinify: true,
};

module.exports = nextConfig;
