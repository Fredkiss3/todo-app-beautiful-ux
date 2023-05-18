"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isSSR } from "~/lib/server-utils";

export async function toggleTheme() {
  const theme = await getThemePreference();

  switch (theme) {
    case "SYSTEM":
      cookies().set("__theme", "DARK");
      break;
    case "DARK":
      cookies().set("__theme", "LIGHT");
      break;
    case "LIGHT":
      cookies().delete("__theme");
      break;
  }

  if (isSSR()) {
    redirect("/");
  }
}
type ThemePreference = "LIGHT" | "DARK" | "SYSTEM";

export async function getThemePreference(): Promise<ThemePreference> {
  return (
    (cookies().get("__theme")?.value as "LIGHT" | "DARK" | undefined) ??
    "SYSTEM"
  );
}
