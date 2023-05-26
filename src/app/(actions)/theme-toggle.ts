"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { THEME_COOKIE_KEY } from "~/lib/constants";
import { isSSR } from "~/lib/server-utils";

export async function toggleTheme() {
  const theme = await getThemePreference();

  switch (theme) {
    case "SYSTEM":
      cookies().set(THEME_COOKIE_KEY, "DARK");
      break;
    case "DARK":
      cookies().set(THEME_COOKIE_KEY, "LIGHT");
      break;
    case "LIGHT":
      cookies().delete(THEME_COOKIE_KEY);
      break;
  }

  if (isSSR()) {
    redirect("/");
  }
}
type ThemePreference = "LIGHT" | "DARK" | "SYSTEM";

export async function getThemePreference(): Promise<ThemePreference> {
  return (
    (cookies().get(THEME_COOKIE_KEY)?.value as "LIGHT" | "DARK" | undefined) ??
    "SYSTEM"
  );
}
