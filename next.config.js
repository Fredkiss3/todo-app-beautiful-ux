require("./src/env.js");

console.log({
  env: process.env.NODE_ENV,
});
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
