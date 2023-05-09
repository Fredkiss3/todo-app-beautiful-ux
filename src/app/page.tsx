import * as React from "react";
import { getTodos } from "./actions";
import { TodoAppClient } from "./todo-app-client";
import { headers } from "next/headers";

export default async function TodoPage({
  searchParams,
}: {
  searchParams: Record<string, string> | undefined;
}) {
  const isSSR = headers().get("accept") !== "text/x-component";

  const Parent = ({ children }: { children: React.ReactNode }) =>
    false ? (
      <>{children}</>
    ) : (
      <React.Suspense fallback={<>loading todos...</>}>
        {children}
      </React.Suspense>
    );

  return (
    <main className="p-8 flex flex-col items-center">
      <div className="flex flex-col items-stretch gap-4 max-w-[400px] w-full">
        <h1 className="text-4xl font-bold ">TODO APP </h1>
        <React.Suspense fallback={<>loading todos...</>}>
          {/* @ts-ignore */}
          <TodoWrapper searchParams={searchParams} />
        </React.Suspense>
      </div>
    </main>
  );
}

async function TodoWrapper(props: {
  searchParams: Record<string, string> | undefined;
}) {
  // @ts-ignore
  const todos = await getTodos(props.searchParams?.filter);

  return <TodoAppClient todos={todos} />;
}
