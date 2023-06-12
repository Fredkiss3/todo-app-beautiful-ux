import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { createSession } from "~/app/(actions)/auth";
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
    console.error({
      error: response.error,
    });
    return redirect("/");
  }

  const ghUser = await fetch("https://api.github.com/user", {
    headers: {
      "User-Agent": `Github-OAuth-${env.GITHUB_CLIENT_ID}`,
      Authorization: `token ${response.access_token}`,
      Accept: "application/json",
    },
  }).then((r) => r.json());

  const res = NextResponse.redirect(new URL("/", req.url));
  createSession(ghUser, res);
  return res;
}
