"use server";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import kv from "@vercel/kv";
import { Todo } from "~/types";
import { schema } from "../validator";
import { isSSR } from "~/lib/server-utils";
import { setFlashMessage } from "../_flash-message/_actions";

export async function getTodos(
  filter?: "completed" | "uncompleted"
): Promise<Todo[]> {
  const data = await kv.get<Todo[]>("todos");
  return (data ?? []).filter((todo) => {
    if (filter === "completed") {
      return todo.completed;
    } else if (filter === "uncompleted") {
      return !todo.completed;
    }
    return true;
  });
}

async function writeTodos(todos: Todo[]): Promise<void> {
  await kv.set("todos", todos);
}

export async function createTodo(formData: FormData) {
  const title = formData.get("title")?.toString();
  const dueDate = new Date(formData.get("dueDate")?.toString() ?? "invalid");

  const result = schema.safeParse(formData);

  if (!result.success) {
    // @ts-ignore
    const queryParams = new URLSearchParams(formData);
    const errors = result.error.flatten().fieldErrors;
    // FIXME : this is a workaround until we can return values from server actions
    // redirect(
    //   `/todo-app?formErrors=${JSON.stringify(errors)}&${queryParams.toString()}`
    // );
  }

  const todos = await getTodos();
  const newTodo: Todo = {
    id: uuidv4(),
    label: title!,
    dueDate: dueDate,
    completed: false,
  };
  todos.push(newTodo);
  await writeTodos(todos);

  if (isSSR()) {
    redirect("/");
  } else {
    setFlashMessage("Todo added with success");
  }
  // redirect("/");
}

export async function toggleTodo(formData: FormData) {
  const id = formData.get("id")?.toString();
  const todos = await getTodos();
  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    console.error("todo not found !");
    return;
  }

  todos[todoIndex] = {
    ...todos[todoIndex],
    completed: !todos[todoIndex].completed,
  };

  await writeTodos(todos);

  if (isSSR()) {
    redirect("/");
  } else {
    setFlashMessage("Todo toggled with success");
  }
  // FIXME
  // console.log("call to `revalidate`");
  // revalidatePath("/");
  // console.log("end call to `revalidate`");
  // await wait(1000);
  // redirect(formData.get("_redirectTo")?.toString() ?? "/");
}

export async function deleteTodo(formData: FormData) {
  const id = formData.get("id")?.toString();
  const todos = await getTodos();
  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    console.error("todo not found !");
    return;
  }

  todos.splice(todoIndex, 1);
  await writeTodos(todos);

  if (isSSR()) {
    redirect("/");
  } else {
    setFlashMessage("Todo deleted with success");
  }
  // FIXME
  // revalidatePath("/");
  // redirect(formData.get("_redirectTo")?.toString() ?? "/");
}
