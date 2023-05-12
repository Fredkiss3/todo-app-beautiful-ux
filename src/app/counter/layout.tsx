import * as React from "react";
import { Counter } from "./counter";
import { getCookie } from "./actions";
import Link from "next/link";

export type LayoutProps = {
  children: React.ReactNode;
};

export default async function Layout({ children }: LayoutProps) {
  console.log("Layout count :", await getCookie());
  return (
    <>
      <h1 className="text-2xl text-red-400">
        Layout Count: {await getCookie()}
      </h1>
      <Counter />

      {children}
    </>
  );
}
