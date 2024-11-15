/** @type {import('next').NextConfig} */
const basePath = process.env.BASE_PATH || "";

const nextConfig = {
  env: {
    basePath,
    apiUrl: process.env.API_URL,
  },
  experimental: {},
  output: "standalone",
};

export default nextConfig;
