/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL,
    ERGOPAD_API: process.env.ERGOPAD_API,
  },
  swcMinify: true,
};

module.exports = nextConfig;
