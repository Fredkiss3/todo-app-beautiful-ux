import { z } from "zod";
import { todoFilterSchema } from "~/lib/validator";
import { env } from "~/env";

import type { AuthSession } from "~/app/(actions)/auth";
import type { KVNamespace } from "~/lib/types";

export type Todo = {
  id: string;
  label: string;
  completed: boolean;
  dueDate?: string | Date;
};


export type TodoFilter = z.infer<typeof todoFilterSchema>;

export async function writeUserTodos(todos: Todo[], user: AuthSession) {
  const kv = env.KV as KVNamespace;
  await kv.put(`todos:${user.id}`, JSON.stringify(todos));
}

export async function getTodosForUser(user: AuthSession, filter?: TodoFilter) {
  const kv = env.KV as KVNamespace;
  const data = JSON.parse(await kv.get(`todos:${user.id}`)) as Todo[];

  return (data ?? []).filter((todo) => {
    if (filter === "completed") {
      return todo.completed;
    } else if (filter === "uncompleted") {
      return !todo.completed;
    }
    return true;
  });
}
