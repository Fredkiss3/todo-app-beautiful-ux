import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { createSession, type AuthSession } from "~/app/_actions/auth";
import { env } from "~/env";

export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get("code");

  if (!code) {
    redirect("/");
  }

  const response: any = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_SECRET,
        redirect_uri: env.GITHUB_REDIRECT_URI,
        code,
      }),
    }
  ).then((r) => r.json());

  if (response.error || !response.access_token) {
    console.log({
      error: response.error,
    });
    return redirect("/");
  }

  const ghUser: any = await fetch("https://api.github.com/user", {
    headers: {
      "User-Agent": `Github-OAuth-${env.GITHUB_CLIENT_ID}`,
      Authorization: `token ${response.access_token}`,
      Accept: "application/json",
    },
  }).then((r) => r.json());

  // FIXME : We won't need to create a Response object when this PR is merged https://github.com/vercel/next.js/pull/49965
  const res = NextResponse.redirect(new URL("/", req.url));
  createSession(ghUser, res);
  return res;
}
