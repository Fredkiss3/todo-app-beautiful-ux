"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getCookie() {
  return Number(cookies().get("count")?.value ?? 0);
}

export async function increment() {
  const cookie = (await getCookie()) + 1;
  // cookies().set("count", cookie.toString());

  // revalidatePath("/counter");
  // revalidatePath("/counter/sub");
  redirect("/");
}
