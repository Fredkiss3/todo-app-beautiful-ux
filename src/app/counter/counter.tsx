"use client";

import * as React from "react";
import { Button } from "~/components/ui/button";
import { increment } from "./actions";

export type CounterProps = {};

export function Counter({}: CounterProps) {
  return (
    <>
      <Button
        onClick={async () => {
          React.startTransition(() => void increment());
        }}
      >
        Increment
      </Button>
    </>
  );
}
