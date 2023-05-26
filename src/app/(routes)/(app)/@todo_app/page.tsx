import * as React from "react";
// components
import { TodoAppClient } from "./todo-app-client";

// utils
import { getTodos } from "~/app/(actions)/todo";
import { getSession } from "~/app/(actions)/auth";

// types
import { todoFilterSchema } from "~/lib/validator";
import { FlashMessage } from "~/components/flash-message";

export default async function TodoPage(props: {
  searchParams: Record<string, string> | undefined;
}) {
  // do not try to call getTodos if session is null because wether the page is rendered or not
  // in the Layout, the page will be called
  if (!(await getSession())) {
    return null;
  }

  const todos = await getTodos(
    todoFilterSchema.parse(props.searchParams?.filter)
  );

  return (
    <>
      <FlashMessage key={Math.random()} />
      <TodoAppClient todos={todos} />
    </>
  );
}
