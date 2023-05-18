// import { z } from "zod";
const { createEnv } = require("@t3-oss/env-nextjs");
const { z } = require("zod");

const env = createEnv({
  server: {
    GITHUB_SECRET: z.string(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_REDIRECT_URI: z.string().url(),
    KV_URL: z.string().url(),
    KV_REST_API_URL: z.string().url(),
    KV_REST_API_TOKEN: z.string(),
    KV_REST_API_READ_ONLY_TOKEN: z.string(),
    JWT_SECRET: z.string().min(32).max(32),
  },
  client: {},
  runtimeEnv: {
    GITHUB_SECRET: process.env.GITHUB_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_REDIRECT_URI: process.env.GITHUB_REDIRECT_URI,
    KV_URL: process.env.KV_URL,
    KV_REST_API_URL: process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
    KV_REST_API_READ_ONLY_TOKEN: process.env.KV_REST_API_READ_ONLY_TOKEN,
    JWT_SECRET: process.env.JWT_SECRET,
  },
});

module.exports = {
  env,
};
