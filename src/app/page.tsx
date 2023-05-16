import * as React from "react";
import { getTodos } from "./@todo_app/_actions";
import { TodoAppClient } from "./todo-app-client";
import { headers } from "next/headers";
import { DarkModeToggle } from "./(dark-mode-toggle)/dark-mode-toggle";

export default async function TodoPage({
  searchParams,
}: {
  searchParams: Record<string, string> | undefined;
}) {
  const isClientNavigation = headers().get("accept") !== "text/html";

  const Parent = ({ children }: { children: React.ReactNode }) =>
    isClientNavigation ? (
      <>{children}</>
    ) : (
      <React.Suspense fallback={<>loading todos...</>}>
        {children}
      </React.Suspense>
    );

  // @ts-ignore
  const todos = await getTodos(searchParams?.filter);

  return (
    <main className="p-8 flex flex-col items-center h-[100svh] justify-center">
      <div className="flex flex-col items-stretch gap-2 max-w-[400px] w-full">
        {/* @ts-expect-error */}
        <DarkModeToggle />
        <TodoAppClient todos={todos} />
      </div>
    </main>
  );
}
