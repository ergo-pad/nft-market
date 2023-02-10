/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL,
    IPFS_URL: process.env.IPFS_URL
  },
  swcMinify: true,
}

module.exports = nextConfig

