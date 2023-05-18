import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "~/app/_actions/auth";
import { setFlash } from "~/components/flash-message/_actions";

export function isSSR() {
  return headers().get("accept") !== "text/x-component";
}
export function withAuth<T extends (...args: any[]) => Promise<any>>(
  action: T
): T {
  return (async (...args: Parameters<T>) => {
    console.log(`WITH AUTH IS CALLED ?`);
    const session = await getSession();

    if (!session) {
      setFlash({
        type: "error",
        message: "You must be authenticated to do this action",
      });
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
