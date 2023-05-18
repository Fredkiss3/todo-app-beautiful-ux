"use server";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { todoCreateSchema } from "~/lib/validator";
import { isSSR, withAuth } from "~/lib/server-utils";
import { setFlash } from "~/components/flash-message/_actions";
import { getSession } from "./auth";
import { Todo, getTodosForUser, writeUserTodos } from "../_models/todos";
import { revalidatePath } from "next/cache";

export const getTodos = withAuth(async () => {
  const user = (await getSession())!;
  return getTodosForUser(user);
});

export const createTodo = withAuth(async (formData: FormData) => {
  const user = (await getSession())!;

  const title = formData.get("title")?.toString();
  const dueDate = new Date(formData.get("dueDate")?.toString() ?? "invalid");

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
    if (isSSR()) {
      redirect("/");
    }
    return;
  }

  const todos = await getTodosForUser(user);
  const newTodo: Todo = {
    id: uuidv4(),
    label: title!,
    dueDate: dueDate,
    completed: false,
  };
  todos.push(newTodo);
  await writeUserTodos(todos, user);

  if (isSSR()) {
    redirect("/");
  } else {
    await setFlash({
      type: "success",
      message: "Item added with success",
    });
  }
  // redirect("/");
});

export const toggleTodo = withAuth(async (formData: FormData) => {
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

  if (isSSR()) {
    redirect("/");
  } else {
    await setFlash({
      type: "success",
      message: todos[todoIndex].completed
        ? "Item marked as finished"
        : "Item marked as unfinished",
    });
  }
  // FIXME
  // console.log("call to `revalidate`");
  // revalidatePath("/");
  // console.log("end call to `revalidate`");
  // await wait(1000);
  // redirect(formData.get("_redirectTo")?.toString() ?? "/");
});

export const deleteTodo = withAuth(async (formData: FormData) => {
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

  if (isSSR()) {
    redirect("/");
  } else {
    await setFlash({
      type: "success",
      message: "Item deleted with success",
    });
  }
  // FIXME
  // revalidatePath("/");
  // redirect(formData.get("_redirectTo")?.toString() ?? "/");
});
