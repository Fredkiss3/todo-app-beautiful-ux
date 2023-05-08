import * as React from "react";
import { getTodos } from "./actions";
import { TodoAppClient } from "./todo-app-client";

export default async function TodoPage({
  searchParams,
}: {
  searchParams: Record<string, string> | undefined;
}) {
  // @ts-ignore
  const todos = await getTodos(searchParams?.filter);
  return (
    <main className="p-8 flex flex-col items-center">
      <div className="flex flex-col items-stretch gap-4 max-w-[400px] w-full">
        <h1 className="text-4xl font-bold ">TODO APP </h1>

        <TodoAppClient todos={todos} />
      </div>
    </main>
  );
}
