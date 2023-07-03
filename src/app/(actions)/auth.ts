"use server";
import * as jose from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isSSR } from "~/lib/server-utils";
import { env } from "~/env";
import { z } from "zod";
import { SESSION_COOKIE_KEY } from "~/lib/constants";
import { setFlash } from "./flash";
import { cache } from "react";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

const authSessionSchema = z.object({
  login: z.string(),
  id: z.number(),
  avatar_url: z.string(),
});

export type AuthSession = z.infer<typeof authSessionSchema>;

export const getSession = cache(
  async function getSession(): Promise<AuthSession | null> {
    const sessionToken = cookies().get(SESSION_COOKIE_KEY)?.value;

    if (!sessionToken) {
      return null;
    }

    try {
      const secret = new TextEncoder().encode(env.JWT_SECRET);
      const { payload } = await jose.jwtVerify(sessionToken, secret);
      return authSessionSchema.parse(payload);
    } catch (error) {
      console.error(
        "There was an error decoding the session Token :",
        (error as Error).message
      );
      return null;
    }
  }
);

export async function destroySession() {
  cookies().delete(SESSION_COOKIE_KEY);

  // FIXME: this condition is a workaround until this PR is merged : https://github.com/vercel/next.js/pull/49439
  if (isSSR()) {
    redirect("/");
  }
}

export async function authenticateWithGithub() {
  redirect(
    `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}&redirect_uri=${env.GITHUB_REDIRECT_URI}`
  );
}

export async function createSession(user: any) {
  const sessionResult = authSessionSchema.safeParse(user);
  if (!sessionResult.success) {
    console.error(sessionResult.error);
    setFlash({
      type: "error",
      message: "An unexpected error happenned on authentication, please retry",
    });
    return;
  }

  // Set cookie to authenticate user
  // Stay connected for 2 days
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 2);

  const secret = new TextEncoder().encode(env.JWT_SECRET);
  const token = await new jose.SignJWT(sessionResult.data)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2d")
    .sign(secret);

  const options: ResponseCookie = {
    name: SESSION_COOKIE_KEY,
    value: token,
    httpOnly: true,
    expires: expirationDate,
  };

  cookies().set(options);
}
