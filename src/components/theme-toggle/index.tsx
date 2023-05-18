import * as React from "react";
import { getThemePreference, toggleTheme } from "./_actions";
import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";

export type DarkModeToggleProps = {};

export default async function ThemeToggle({}: DarkModeToggleProps) {
  const theme = await getThemePreference();
  return (
    <form action={toggleTheme} className="flex justify-end">
      <button
        className="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-2 p-2 text-black-500 dark:text-black-400 hover:bg-black-50 dark:hover:bg-black-950 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black-500 dark:focus-visible:ring-black-400 inline-flex items-center"
        type="submit"
      >
        {theme === "DARK" ? (
          <MoonIcon className="flex-shrink-0 h-4 w-4" />
        ) : theme === "LIGHT" ? (
          <SunIcon className="flex-shrink-0 h-4 w-4" />
        ) : (
          <ComputerDesktopIcon className="flex-shrink-0 h-4 w-4" />
        )}
      </button>
    </form>
  );
}
