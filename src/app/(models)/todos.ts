import kv from "@vercel/kv";
import { z } from "zod";
import type { AuthSession } from "~/app/(actions)/auth";
import { todoFilterSchema } from "~/lib/validator";

export type Todo = {
  id: string;
  label: string;
  completed: boolean;
  dueDate?: string | Date;
};

export type TodoFilter = z.infer<typeof todoFilterSchema>;

export async function writeUserTodos(todos: Todo[], user: AuthSession) {
  await kv.set(`todos:${user.id}`, todos);
}

export async function getTodosForUser(user: AuthSession, filter?: TodoFilter) {
  const data = await kv.get<Todo[]>(`todos:${user.id}`);

  return (data ?? []).filter((todo) => {
    if (filter === "completed") {
      return todo.completed;
    } else if (filter === "uncompleted") {
      return !todo.completed;
    }
    return true;
  });
}
