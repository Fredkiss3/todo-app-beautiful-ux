"use server";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { todoCreateSchema } from "~/lib/validator";
import { isSSR, withAuth } from "~/lib/server-utils";
import { setFlash } from "./flash";
import { getSession } from "./auth";
import { getTodosForUser, writeUserTodos } from "~/app/(models)/todos";

import type { Todo, TodoFilter } from "~/app/(models)/todos";

export const getTodos = withAuth(async (filter?: TodoFilter) => {
  const user = (await getSession())!;
  return getTodosForUser(user, filter);
});

export const createTodo = withAuth(async function createTodo(
  formData: FormData
) {
  const user = (await getSession())!;

  const title = formData.get("title")?.toString();

  const result = todoCreateSchema.safeParse(formData);

  if (!result.success) {
    // @ts-ignore
    // const queryParams = new URLSearchParams(formData);
    // const errors = result.error.flatten().fieldErrors;
    // FIXME : this is a workaround until we can return values from server actions
    // redirect(
    //   `/todo-app?formErrors=${JSON.stringify(errors)}&${queryParams.toString()}`
    // );
    setFlash({
      type: "error",
      message: "Your input is invalid",
    });

    // FIXME: this is a workaround until this PR is merged : https://github.com/vercel/next.js/pull/49439
    if (isSSR()) {
      redirect("/");
    }
    return;
  }

  const todos = await getTodosForUser(user);
  const newTodo: Todo = {
    id: uuidv4(),
    label: result.data.title,
    dueDate: result.data.dueDate,
    completed: false,
  };
  todos.push(newTodo);
  await writeUserTodos(todos, user);

  await setFlash({
    type: "success",
    message: "Item added with success",
  });

  // FIXME: this condition is a workaround until this PR is merged : https://github.com/vercel/next.js/pull/49439
  if (isSSR()) {
    const currentFilter = formData.get("_currentFilter")?.toString();
    redirect(
      currentFilter
        ? `/?filter=${encodeURIComponent(currentFilter).toString()}`
        : "/"
    );
  }
});

export const toggleTodo = withAuth(async function toggleTodo(
  formData: FormData
) {
  const user = (await getSession())!;
  const id = formData.get("id")?.toString();
  const todos = await getTodosForUser(user);
  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    await setFlash({
      type: "error",
      message: "Item not found !",
    });
    console.error("Item not found !");
    return;
  }

  todos[todoIndex] = {
    ...todos[todoIndex],
    completed: !todos[todoIndex].completed,
  };

  await writeUserTodos(todos, user);

  await setFlash({
    type: "success",
    message: todos[todoIndex].completed
      ? "Item marked as finished"
      : "Item marked as unfinished",
  });

  // FIXME: this condition is a workaround until this PR is merged : https://github.com/vercel/next.js/pull/49439
  if (isSSR()) {
    const currentFilter = formData.get("_currentFilter")?.toString();
    redirect(
      currentFilter
        ? `/?filter=${encodeURIComponent(currentFilter).toString()}`
        : "/"
    );
  }
});

export const deleteTodo = withAuth(async function deleteTodo(
  formData: FormData
) {
  const user = (await getSession())!;
  const id = formData.get("id")?.toString();
  const todos = await getTodosForUser(user);
  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    console.error("Item not found !");
    return;
  }

  todos.splice(todoIndex, 1);
  await writeUserTodos(todos, user);

  await setFlash({
    type: "success",
    message: "Item deleted with success",
  });

  // FIXME: this condition is a workaround until this PR is merged : https://github.com/vercel/next.js/pull/49439
  if (isSSR()) {
    const currentFilter = formData.get("_currentFilter")?.toString();
    redirect(
      currentFilter
        ? `/?filter=${encodeURIComponent(currentFilter).toString()}`
        : "/"
    );
  }
});
