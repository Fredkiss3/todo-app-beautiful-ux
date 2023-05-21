"use client";

import {
  ArrowLeftOnRectangleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/shared-utils";

export type UserDropdownProps = {
  avatar_url: string;
  login: string;
  logoutAction: () => Promise<void>;
};

export function UserDropdown(props: UserDropdownProps) {
  const [isSSR, setIsSSR] = React.useState(true);
  React.useEffect(() => {
    setIsSSR(false);
  }, []);
  return (
    <form className="max-w-fit relative" action={props.logoutAction}>
      <DropdownMenu>
        <DropdownMenuTrigger
          type="button"
          className="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-2 px-3 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-900 dark:text-white bg-white hover:bg-gray-50 disabled:bg-white dark:bg-gray-900 dark:hover:bg-gray-800/50 dark:disabled:bg-gray-900 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 inline-flex items-center"
        >
          <span className="relative inline-flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full h-4 w-4 text-xs">
            {/*  eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={props.avatar_url}
              alt="User Avatar"
              className="rounded-full h-4 w-4 text-xs"
            />
          </span>
          <span>{props.login}</span>
          <ChevronDownIcon className="flex-shrink-0 h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={cn(
            "absolute z-10 rounded-md ",
            "divide-y divide-gray-200 ring-1 ring-gray-200 shadow-lg bg-white",
            "focus:outline-none dark:divide-gray-700 dark:ring-gray-700 dark:bg-gray-800",
            isSSR ? "-top-[calc(100%+1rem)] mb-2" : "w-full mt-2"
          )}
          static={isSSR}
        >
          <DropdownMenuItem>
            <button
              className={cn(
                "w-full p-1",
                "text-sm rounded-md text-gray-700 dark:text-gray-200"
              )}
              type="submit"
              onClick={() => {
                React.startTransition(() => void props.logoutAction());
              }}
            >
              <div className="px-2 py-1.5 flex items-center gap-2">
                <ArrowLeftOnRectangleIcon className="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500" />
                Logout
              </div>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </form>
  );
}
