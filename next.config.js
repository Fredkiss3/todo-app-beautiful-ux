/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    logging: "verbose",
    // incrementalCacheHandlerPath: "",
  },
};

module.exports = nextConfig;
