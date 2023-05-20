require("./src/env.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "development"
        ? undefined
        : {
            exclude: ["error"],
          },
  },
  experimental: {
    serverActions: true,
    logging: "verbose",
  },
};

module.exports = nextConfig;
