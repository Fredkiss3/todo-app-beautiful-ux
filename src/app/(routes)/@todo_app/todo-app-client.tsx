"use client";
import * as React from "react";
import { FormErrors, ArrayItem } from "~/types";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { experimental_useOptimistic as useOptimistic } from "react";
import { createTodo, toggleTodo, deleteTodo } from "~/app/_actions/todo";
import { todoCreateSchema } from "~/lib/validator";
import { cn } from "~/lib/utils";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Toggle } from "~/components/ui/switch";
import type { Todo } from "~/app/_models/todos";

export type TodoAppClientProps = {
  todos: Todo[];
};

export function TodoAppClient({ todos }: TodoAppClientProps) {
  const [optimisticTodos, addTodo] = useOptimistic<
    (Todo & { optimistic?: boolean })[],
    Todo
  >(todos, (state, newTodo: Todo) => [
    ...state,
    { ...newTodo, optimistic: true },
  ]);

  const id = React.useId();

  const [createTodoFormErrors, setCreateTodoFormErrors] =
    React.useState<FormErrors | null>(null);

  const ref = React.useRef<CreateTodoFormHandle>(null);

  return (
    <div className="flex flex-col gap-4">
      <form
        action={createTodo}
        onSubmit={(e) => {
          const form = e.currentTarget;
          const fd = new FormData(form);
          const result = todoCreateSchema.safeParse(fd);

          if (result.success) {
            addTodo({
              completed: false,
              id: `${id}-${optimisticTodos.length}`,
              label: result.data.title,
              dueDate: result.data.dueDate,
            });
            setCreateTodoFormErrors(null);
          } else {
            setCreateTodoFormErrors(result.error.flatten().fieldErrors);
            e.preventDefault();
          }
          ref.current?.focus();
        }}
      >
        <CreateTodoFormInner ref={ref} errors={createTodoFormErrors} />
      </form>

      {optimisticTodos.length > 0 && (
        <ul>
          {optimisticTodos
            .sort((a, b) =>
              a.dueDate && b.dueDate
                ? new Date(a.dueDate).valueOf() - new Date(b.dueDate).valueOf()
                : 0
            )
            .map((todo, index) => (
              <li
                key={todo.id}
                className={cn(
                  index < optimisticTodos.length - 1 &&
                    "border-b border-gray-200 dark:border-gray-800"
                )}
              >
                <form>
                  <TodoItemFormOuter todo={todo} optimistic={todo.optimistic} />
                </form>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

type CreateTodoFormHandle = {
  focus: () => void;
};

const CreateTodoFormInner = React.forwardRef<
  CreateTodoFormHandle,
  { errors: FormErrors | null }
>(function CreateTodoFormInner(props, ref) {
  const { pending: isPending } = useFormStatus();
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus();
    },
  }));

  React.useEffect(() => {
    if (!isPending && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(0, inputRef.current.value.length);
    }
  }, [isPending]);

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex gap-4 items-center w-full">
        <input
          ref={inputRef}
          className={cn(
            "relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none text-sm px-3 py-1.5 border-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md shadow-sm ring-1 ring-inset  dark:ring-gray-700 focus:ring-2  placeholder:text-gray-400 dark:placeholder:text-gray-500",
            props.errors?.title && Array.isArray(props.errors?.title)
              ? "ring-red-400 focus:ring-red-500 dark:focus:ring-red-400"
              : "ring-gray-300 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          )}
          type="text"
          name="title"
          autoFocus
          placeholder="Eat, sleep, code"
          required
        />
        <button
          className={cn(
            "inline-flex items-center flex-shrink-0 shadow-sm text-white",
            "font-medium rounded-md text-sm gap-x-2 px-3 py-1.5",
            "disabled:cursor-not-allowed disabled:opacity-75 disabled:bg-primary-500",
            "dark:hover:bg-indigo-500 dark:disabled:bg-indigo-400",
            "focus:outline-none  dark:text-gray-900 bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:focus-visible:outline-indigo-400"
          )}
        >
          Add <span className="sr-only">Item</span>
          <PlusIcon className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* FIXME : when actionstate available, use errors from actions */}
      {props.errors?.title && Array.isArray(props.errors?.title) && (
        <ul
          aria-live="assertive"
          className="pl-0 text-red-400 text-sm m-0 py-2"
        >
          {props.errors?.title.map((err, idx) => (
            <li key={idx}>{err}</li>
          ))}
        </ul>
      )}
    </div>
  );
});

function TodoItemFormOuter(props: Omit<TodoItemFormProps, "isDeletingTodo">) {
  const { pending, action } = useFormStatus();

  return (
    <TodoItemFormInnerMemo
      {...props}
      isDeletingTodo={pending && action === deleteTodo}
    />
  );
}

const TodoItemFormInnerMemo = React.memo(TodoItemFormInner);

type TodoItemFormProps = {
  todo: ArrayItem<TodoAppClientProps["todos"]>;
  optimistic?: boolean;
  isDeletingTodo?: boolean;
};

function TodoItemFormInner({
  todo,
  optimistic,
  isDeletingTodo,
}: TodoItemFormProps) {
  const [optimisticTodo, toggleOptimistic] = useOptimistic(todo);
  const toggleBtnRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div
      className={cn(
        "flex items-center gap-4 py-2 justify-between",
        isDeletingTodo || optimistic ? "opacity-50" : "opacity-100"
      )}
    >
      <input type="hidden" name="id" defaultValue={todo.id} />

      <p
        className={cn(
          "flex-1 font-medium",
          optimisticTodo.completed && "line-through text-gray-500"
        )}
      >
        {todo.label}
      </p>

      {!optimistic && (
        <div className="flex items-center gap-2">
          <Toggle
            enabled={optimisticTodo.completed}
            altText={
              optimisticTodo.completed
                ? "mark item as unfinished"
                : "mark item as finished"
            }
            type="submit"
            ref={toggleBtnRef}
            formAction={toggleTodo}
            disabled={isDeletingTodo || optimistic}
            onChange={(completed) => {
              toggleOptimistic((state) => ({
                ...state,
                completed,
              }));

              const form = toggleBtnRef.current?.closest("form");
              if (form) {
                const fd = new FormData(form);
                React.startTransition(() => void toggleTodo(fd));
              }
            }}
          />
          <button
            className="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-xs gap-x-1 p-[5px] text-red-500 dark:text-red-400 bg-red-50 hover:bg-red-100 dark:bg-red-950 dark:hover:bg-red-900 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-500 dark:focus-visible:ring-red-400 inline-flex items-center"
            formAction={deleteTodo}
            disabled={isDeletingTodo}
          >
            <span className="sr-only">delete item</span>
            <XMarkIcon className="flex-shrink-0 h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
