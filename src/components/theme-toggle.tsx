import * as React from "react";
// components
import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";

// utils
import { getThemePreference, toggleTheme } from "~/app/(actions)/theme-toggle";

// types
export type DarkModeToggleProps = {};

export async function ThemeToggle({}: DarkModeToggleProps) {
  const theme = await getThemePreference();
  return (
    <form action={toggleTheme} className="flex justify-end">
      <button
        className="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-2 p-2 text-black-500 dark:text-black-400 hover:bg-black-50 dark:hover:bg-black-950 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black-500 dark:focus-visible:ring-black-400 inline-flex items-center"
        type="submit"
      >
        {theme === "DARK" ? (
          <>
            <span className="sr-only">set theme to light</span>
            <MoonIcon className="flex-shrink-0 h-4 w-4" />
          </>
        ) : theme === "LIGHT" ? (
          <>
            <span className="sr-only">set theme to system</span>
            <SunIcon className="flex-shrink-0 h-4 w-4" />
          </>
        ) : (
          <>
            <span className="sr-only">set theme to dark</span>
            <ComputerDesktopIcon className="flex-shrink-0 h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
