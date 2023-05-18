import * as React from "react";
import { getTodos } from "./@todo_app/_actions";
import { TodoAppClient } from "./todo-app-client";
import { DarkModeToggle } from "./_dark-mode-toggle/dark-mode-toggle";

export default async function TodoPage(props: {
  searchParams: Record<string, string> | undefined;
}) {
  const todos = await getTodos();

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
