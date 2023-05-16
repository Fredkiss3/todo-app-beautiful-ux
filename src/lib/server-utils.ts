import { headers } from "next/headers";

export function isSSR() {
  return headers().get("accept") !== "text/x-component";
}
