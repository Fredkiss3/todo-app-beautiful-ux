import { ReactNode } from "react";
import { cookies } from "next/headers";

declare global {
  namespace React.JSX {
    type ElementType =
      | keyof React.JSX.IntrinsicElements
      | ((props: any) => Promise<ReactNode> | ReactNode);
  }
}
