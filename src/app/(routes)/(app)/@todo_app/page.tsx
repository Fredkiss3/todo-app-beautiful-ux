import * as React from "react";
// components
import { TodoList } from "~/app/(components)/todo-list";
import { CreateTodoForm } from "~/app/(components)/create-todo-form";
import { TodoListSkeleton } from "~/app/(components)/todo-list-skeleton";
import { FlashMessage } from "~/app/(components)/flash-message";
import Link from "next/link";

// utils
import { getTodos } from "~/app/(actions)/todo";
import { getSession } from "~/app/(actions)/auth";
import { todoFilterSchema } from "~/lib/validator";

export default async function TodoPage(props: {
  searchParams: Record<string, string> | undefined;
}) {
  // do not try to call getTodos if session is null because wether the page is rendered or not
  // in the Layout, the page will be called
  if (!(await getSession())) {
    return null;
  }

  return (
    <>
      <FlashMessage key={Math.random()} />

      <div className="flex flex-col gap-4">
        <CreateTodoForm />

        <nav className="flex gap-2 justify-between items-center py-2">
          <Link className="underline" href={`/?filter=completed`}>
            Show finished
          </Link>
          <div className="h-5 bg-slate-700 w-[1px]" />
          <Link className="underline" href={`/?filter=uncompleted`}>
            Show unfinished
          </Link>
          <div className="h-5 bg-slate-700 w-[1px]" />
          <Link className="underline" href={`/`}>
            Show all
          </Link>
        </nav>

        <React.Suspense
          fallback={<TodoListSkeleton />}
          key={props.searchParams?.filter}
        >
          <TodoListAsync filter={props.searchParams?.filter} />
        </React.Suspense>
      </div>
    </>
  );
}

async function TodoListAsync({ filter }: { filter: string | undefined }) {
  const todos = await getTodos(todoFilterSchema.parse(filter));
  return <TodoList initialTodos={todos} />;
}
