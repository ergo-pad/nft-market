/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL,
    IPFS_URL: process.env.IPFS_URL,
    NFT_STORAGE_KEY: process.env.NFT_STORAGE_KEY
  },
  swcMinify: true,
}

module.exports = nextConfig

