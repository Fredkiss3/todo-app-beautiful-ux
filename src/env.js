// import { z } from "zod";
const { createEnv } = require("@t3-oss/env-nextjs");
const { z } = require("zod");

const env = createEnv({
  server: {
    GITHUB_SECRET: z.string(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_REDIRECT_URI: z.string().url(),
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
    JWT_SECRET: z.string().min(32).max(32),
  },
  client: {},
  runtimeEnv: {
    GITHUB_SECRET: process.env.GITHUB_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_REDIRECT_URI: process.env.GITHUB_REDIRECT_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  },
});

module.exports = {
  env,
};
