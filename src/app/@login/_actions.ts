"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { isSSR } from "~/lib/server-utils";

type AuthState = { login: string; password: string } | null;

export async function getUser(): Promise<AuthState> {
  const userCookie = cookies().get("__user");
  return userCookie?.value ? JSON.parse(userCookie.value) : null;
}

export async function setUser(user: AuthState) {
  if (user) {
    cookies().set(
      "__user",
      JSON.stringify({
        ...user,
      })
    );
  } else {
    cookies().delete("__user");
  }
}

async function logout(formData: FormData) {
  "use server";
  setUser(null);

  const user = await getUser();
  console.log({
    loggedOutUser: user,
  });
  if (isSSR()) {
    redirect("/");
  }
  // redirect("/dashboard");
}
