"use client";
import * as React from "react";
// components
import { Toggle } from "~/app/(components)/ui/toggle";
import { XMarkIcon } from "@heroicons/react/24/outline";

// utils
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { experimental_useOptimistic as useOptimistic } from "react";
import { deleteTodo, toggleTodo } from "~/app/(actions)/todo";
import { todoFilterSchema } from "~/lib/validator";
import { useSearchParams } from "next/navigation";
import { cn } from "~/lib/shared-utils";
import { useTodoStore } from "~/lib/todo-store";

// types
import type { Todo } from "~/app/(models)/todos";

export type TodoListProps = {
  initialTodos: Todo[];
};

export function TodoList({ initialTodos }: TodoListProps) {
  React.useEffect(() => {
    // Reset state with server state
    if (initialTodos !== useTodoStore.getState().items) {
      useTodoStore.setState({
        items: initialTodos,
      });
    }
  }, [initialTodos]);

  const items = useTodoStore((store) => store.items);

  return (
    <ul>
      {items
        .sort((a, b) =>
          a.dueDate && b.dueDate
            ? new Date(a.dueDate).valueOf() - new Date(b.dueDate).valueOf()
            : 0
        )
        .map((todo, index) => (
          <li
            key={todo.id}
            className={cn(
              index < items.length - 1 &&
                "border-b border-gray-200 dark:border-gray-800"
            )}
          >
            <form action={toggleTodo}>
              <TodoItemFormOuter todo={todo} optimistic={todo.isOptimistic} />
            </form>
          </li>
        ))}
    </ul>
  );
}

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
  todo: Todo;
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

  const currentFilter = todoFilterSchema.parse(useSearchParams().get("filter"));

  return (
    <div
      className={cn(
        "flex items-center gap-4 py-2 justify-between",
        isDeletingTodo || optimistic ? "opacity-50" : "opacity-100"
      )}
    >
      <input type="hidden" name="id" defaultValue={todo.id} readOnly />

      <input
        type="hidden"
        name="_currentFilter"
        defaultValue={currentFilter}
        readOnly
      />
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
            disabled={isDeletingTodo || optimistic}
            onChange={(completed) => {
              toggleOptimistic((state) => ({
                ...state,
                completed,
              }));

              toggleBtnRef.current?.form?.requestSubmit();
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
