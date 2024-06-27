/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'i.scdn.co',
    ],
    unoptimized: true,
  },
};

export default nextConfig;
