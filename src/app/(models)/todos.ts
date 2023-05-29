import { z } from "zod";
import { todoFilterSchema } from "~/lib/validator";
import { Redis } from "@upstash/redis";
import { env } from "~/env";

import type { AuthSession } from "~/app/(actions)/auth";

export type Todo = {
  id: string;
  label: string;
  completed: boolean;
  dueDate?: string | Date;
};

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

export type TodoFilter = z.infer<typeof todoFilterSchema>;

export async function writeUserTodos(todos: Todo[], user: AuthSession) {
  await redis.set(`todos:${user.id}`, todos);
}

export async function getTodosForUser(user: AuthSession, filter?: TodoFilter) {
  const data = await redis.get<Todo[]>(`todos:${user.id}`);

  return (data ?? []).filter((todo) => {
    if (filter === "completed") {
      return todo.completed;
    } else if (filter === "uncompleted") {
      return !todo.completed;
    }
    return true;
  });
}
