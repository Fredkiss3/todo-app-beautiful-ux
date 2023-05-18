require("./src/env.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    logging: "verbose",
  },
};

module.exports = nextConfig;
