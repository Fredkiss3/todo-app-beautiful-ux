"use server";

import { cookies } from "next/headers";
import { z } from "zod";

const flashSchema = z.object({
  type: z.enum(["success", "error"]),
  message: z.string(),
});

export type Flash = z.infer<typeof flashSchema>;

export async function getFlash() {
  const flashCookie = cookies().get("__flash")?.value;
  if (!flashCookie) {
    return null;
  }

  try {
    return flashSchema.parse(JSON.parse(flashCookie));
  } catch (error) {
    // do nothing
    console.error((error as Error).message);
  } finally {
    if (flashCookie) {
      // delete flash cookie on read
      cookies().delete("__flash");
    }
  }
  return null;
}

export async function setFlash(message: Flash) {
  cookies().set("__flash", JSON.stringify(message));
}
