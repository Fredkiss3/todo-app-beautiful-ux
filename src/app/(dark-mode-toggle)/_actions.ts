"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isSSR } from "~/lib/server-utils";

export async function toggleDarkMode() {
  const darkMode = await isDarkMode();
  if (darkMode) {
    console.log("delete darkMode !");
    cookies().delete("__darkMode");
  } else {
    console.log("delete darkMode !");
    cookies().set("__darkMode", "true");
  }

  if (isSSR()) {
    redirect("/");
  }
}

export async function isDarkMode() {
  return Boolean(cookies().get("__darkMode"));
}
