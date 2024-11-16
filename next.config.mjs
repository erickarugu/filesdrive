/** @type {import('next').NextConfig} */
const basePath = process.env.BASE_PATH || "";

const nextConfig = {
  env: {
    basePath,
    apiUrl: process.env.API_URL,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    nextAuthSecret: process.env.NEXTAUTH_SECRET,
  },
  experimental: {},
  output: "standalone",
};

export default nextConfig;
