/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'ppl-ai-file-upload.s3.amazonaws.com',
      'localhost',
      'i.postimg.cc',
      'postimg.cc',
      'iili.io',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.postimg.cc',
      },
    ],
  },
};

module.exports = nextConfig;
