"use client";
import { Switch } from "@headlessui/react";
import * as React from "react";

type ToggleProps = {
  enabled?: boolean;
  onChange?: (checked: boolean) => void;
  altText: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onChange">;

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  function Toggle({ enabled, onChange, altText, ...props }, ref) {
    return (
      <Switch
        ref={ref}
        as="button"
        checked={enabled}
        onChange={onChange}
        className={`${
          enabled
            ? "bg-indigo-500 dark:bg-indigo-400"
            : "bg-gray-200 dark:bg-gray-700"
        }
            relative inline-flex flex-shrink-0 h-5 w-9 border-2 border-transparent rounded-full cursor-pointer disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900    
      `}
        {...props}
      >
        <span className="sr-only">{altText}</span>
        <span
          aria-hidden="true"
          className={`${enabled ? "translate-x-4" : "translate-x-0"}
         pointer-events-none relative inline-block h-4 w-4 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
        />
      </Switch>
    );
  }
);
