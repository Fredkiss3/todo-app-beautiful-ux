import * as React from "react";
import { getTodos } from "~/app/_actions/todo";
import { TodoAppClient } from "./todo-app-client";

export default async function TodoPage(props: {
  searchParams: Record<string, string> | undefined;
}) {
  const todos = await getTodos();

  return <TodoAppClient todos={todos} />;
}
