"use client";

import * as React from "react";
import { Button } from "~/components/ui/button";
import { increment } from "./actions";

export type CounterProps = {};

export function Counter({}: CounterProps) {
  return (
    <form>
      <Button formAction={increment}>Increment</Button>
    </form>
  );
}
