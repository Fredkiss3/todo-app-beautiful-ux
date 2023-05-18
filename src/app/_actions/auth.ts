"use server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { isSSR } from "~/lib/server-utils";
import { env } from "~/env";
import jwt from "jsonwebtoken";
import { z } from "zod";
import type { NextResponse } from "next/server";
import { SESSION_COOKIE_KEY } from "~/lib/constants";

const authSessionSchema = z.object({
  login: z.string(),
  id: z.number(),
  avatar_url: z.string(),
});

export type AuthSession = z.infer<typeof authSessionSchema>;

export async function getSession(): Promise<AuthSession | null> {
  console.log("GET SESSION CALLED");
  const sessionToken = cookies().get(SESSION_COOKIE_KEY)?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    return authSessionSchema.parse(jwt.verify(sessionToken, env.JWT_SECRET));
  } catch (error) {
    console.error(
      "There was an error decoding the session Token :",
      (error as Error).message
    );
    return null;
  }
}

export async function destroySession() {
  console.log("DESTROY SESSION CALLED");
  cookies().delete(SESSION_COOKIE_KEY);

  if (isSSR()) {
    redirect("/");
  }
}

export async function authenticateWithGithub() {
  console.log("AUTH WITH GITHUB CALLED");
  redirect(
    `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}&redirect_uri=${env.GITHUB_REDIRECT_URI}`
  );
}

export async function createSession(user: any, response?: NextResponse) {
  console.log("CREATE SESSION CALLED");
  const sessionResult = authSessionSchema.safeParse(user);
  if (!sessionResult.success) {
    console.error(sessionResult.error);
    return;
  }

  // Set cookie to authenticate user
  // Stay connected for 2 days
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 2);

  const token = jwt.sign(sessionResult.data, env.JWT_SECRET, {
    expiresIn: `2d`,
    algorithm: "HS256",
  });

  if (response) {
    // FIXME : remove this code when this PR is merged https://github.com/vercel/next.js/pull/49965
    response.cookies.set({
      name: SESSION_COOKIE_KEY,
      value: token,
      httpOnly: true,
      expires: expirationDate,
    });
  } else {
    cookies().set({
      name: SESSION_COOKIE_KEY,
      value: token,
      httpOnly: true,
      expires: expirationDate,
    });
  }
}
