import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthSession, getSession } from "~/app/_actions/auth";

export function isSSR() {
  return headers().get("accept") !== "text/x-component";
}
export function withAuth<T extends (...args: any[]) => Promise<any>>(
  action: T
): T {
  return (async (...args: Parameters<T>) => {
    const session = await getSession();

    if (!session) {
      if (isSSR()) {
        redirect("/");
      } else {
        return {
          error: "Unauthenticated",
        };
      }
    }

    return action(...args);
  }) as T;
}
