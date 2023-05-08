"use client";
import * as React from "react";
import { FormErrors, Todo, ArrayItem } from "~/types";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { experimental_useOptimistic as useOptimistic } from "react";
import { createTodo, toggleTodo, deleteTodo } from "./actions";
import { schema } from "./validator";
import { Button } from "~/components/ui/button";
import { Check, Trash2 } from "lucide-react";
import { Input } from "~/components/ui/input";
import { DatePicker } from "~/components/ui/date-picker";
import { formatRelative } from "date-fns";
import { cn } from "~/lib/utils";
import Link from "next/link";

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

  return (
    <>
      <form
        className="w-full flex items-start gap-4 flex-col"
        onSubmit={(e) => {
          const form = e.currentTarget;
          const fd = new FormData(form);
          const result = schema.safeParse(fd);

          if (result.success) {
            addTodo({
              completed: false,
              id: `${id}-${optimisticTodos.length}`,
              label: result.data.title,
              dueDate: result.data.dueDate,
            });
            const input = form.querySelector(
              'input[name="title"]'
            ) as HTMLInputElement | null;
            input?.focus();
          } else {
            setCreateTodoFormErrors(result.error.flatten().fieldErrors);
          }
        }}
      >
        <CreateTodoFormInner errors={createTodoFormErrors} />
      </form>

      {optimisticTodos.length === 0 ? (
        <p className="text-gray-400 font-bold italic">NO TODO yet</p>
      ) : (
        <ul>
          {optimisticTodos
            .sort(
              (a, b) =>
                new Date(a.dueDate).valueOf() - new Date(b.dueDate).valueOf()
            )
            .map((todo) => (
              <li key={todo.id}>
                <form>
                  <TodoItemFormInner todo={todo} optimistic={todo.optimistic} />
                </form>
              </li>
            ))}
        </ul>
      )}
    </>
  );
}

function CreateTodoFormInner(props: { errors: FormErrors | null }) {
  return (
    <>
      <Input
        type="text"
        name="title"
        autoFocus
        placeholder="Eat, sleep, code"
      />
      {props.errors?.title && Array.isArray(props.errors?.title) && (
        <ul
          aria-live="assertive"
          style={{ color: "red", margin: 0, paddingLeft: 20 }}
        >
          {props.errors?.title.map((err, idx) => (
            <li key={idx}>{err}</li>
          ))}
        </ul>
      )}

      <DatePicker name="dueDate" />
      {props.errors?.dueDate && Array.isArray(props.errors?.dueDate) && (
        <ul
          aria-live="assertive"
          style={{ color: "red", margin: 0, paddingLeft: 20 }}
        >
          {props.errors?.dueDate.map((err, idx) => (
            <li key={idx}>{err}</li>
          ))}
        </ul>
      )}
      <br />

      <Button formAction={createTodo}>Add TODO</Button>
    </>
  );
}

function TodoItemFormInner({
  todo,
  optimistic,
}: {
  todo: ArrayItem<TodoAppClientProps["todos"]>;
  optimistic?: boolean;
}) {
  const [optimisticTodo, toggleOptimistic] = useOptimistic(todo);
  const { pending, action } = useFormStatus();

  const isDeletingTodo = pending && action === deleteTodo;

  return (
    <div
      className={cn(
        "flex items-center gap-4 group border-2 border-primary justify-between px-2 py-1 font-semibold",
        isDeletingTodo || optimistic ? "opacity-50" : "opacity-100"
      )}
    >
      <input type="hidden" name="id" defaultValue={todo.id} />
      <div className="flex items-center gap-2">
        <button
          className={cn(
            "h-4 w-4 border-primary border-2 flex items-center justify-center text-white",
            "disabled:border-gray-400",
            optimisticTodo.completed && "bg-primary"
          )}
          formAction={toggleTodo}
          disabled={isDeletingTodo || optimistic}
          onClick={(e) => {
            toggleOptimistic((state) => ({
              ...state,
              completed: !state.completed,
            }));
            console.log("toggle optimistic");
          }}
        >
          <span className="sr-only">toggle todo</span>
          {optimisticTodo.completed && (
            <Check className="h-4 w-4 text-white" strokeWidth={4} />
          )}
        </button>

        <p className="py-2">{todo.label}</p>
      </div>

      {!optimistic && (
        <div className="flex items-center gap-2">
          <span className="text-gray-400">
            {formatRelative(new Date(todo.dueDate), new Date())}
          </span>
          <Button
            variant="ghost"
            value={todo.id}
            formAction={deleteTodo}
            disabled={isDeletingTodo}
          >
            <Trash2 className="h-4 w-4 text-destructive" />

            <span className="sr-only">delete todo</span>
          </Button>
        </div>
      )}
    </div>
  );
}
