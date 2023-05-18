"use server";

import { cookies } from "next/headers";

export async function getFlashMessage() {
  const flashCookie = cookies().get("__flash");

  if (flashCookie) {
    // delete flash cookie on read
    cookies().delete("__flash");
  }

  return flashCookie?.value ?? null;
}

export async function setFlashMessage(message: string) {
  cookies().set("__flash", message);
}
