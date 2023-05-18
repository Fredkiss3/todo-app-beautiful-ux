import * as React from "react";
import { getTodos } from "~/app/_actions/todo";
import { TodoAppClient } from "./todo-app-client";
import { getSession } from "~/app/_actions/auth";

export default async function TodoPage(props: {
  searchParams: Record<string, string> | undefined;
}) {
  console.log("TODO PAGE");

  // do not try to call getTodos if session is null because wether the page is rendered or not
  // in the Layout, the page will be called
  if (!(await getSession())) {
    return null;
  }

  const todos = await getTodos();

  return <TodoAppClient todos={todos} />;
}
