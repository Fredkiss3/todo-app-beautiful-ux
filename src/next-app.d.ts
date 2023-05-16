import { ReactNode } from "react";
import type { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

declare global {
  namespace JSX {
    type ElementType =
      | keyof JSX.IntrinsicElements
      | ((props: any) => Promise<ReactNode> | ReactNode);
  }
}

declare module "next/headers" {
  function cookies(): ResponseCookies;
}
