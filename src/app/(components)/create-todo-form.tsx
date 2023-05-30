"use client";
import * as React from "react";
// components
import { PlusIcon } from "@heroicons/react/24/outline";

// utils
import { createTodo } from "~/app/(actions)/todo";
import { cn } from "~/lib/shared-utils";
import { todoCreateSchema, todoFilterSchema } from "~/lib/validator";
import { useSearchParams } from "next/navigation";
import { useTodoStore } from "~/lib/todo-store";

// types
import type { FormErrors } from "~/types";

export type CreateTodoFormProps = {};

export function CreateTodoForm({}: CreateTodoFormProps) {
  const id = React.useId();
  const addOptimisticTodo = useTodoStore((store) => store.addTodo);
  const [formErrors, setFormErrors] = React.useState<FormErrors | null>(null);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const currentFilter = todoFilterSchema.parse(useSearchParams().get("filter"));

  return (
    <>
      <form
        action={createTodo}
        onSubmit={(e) => {
          const result = todoCreateSchema.safeParse(
            new FormData(e.currentTarget)
          );

          if (result.success) {
            addOptimisticTodo({
              completed: false,
              id: `${id}-${Math.random()}`,
              label: result.data.title,
              dueDate: result.data.dueDate,
            });
            setFormErrors(null);
          } else {
            setFormErrors(result.error.flatten().fieldErrors);
            e.preventDefault();
          }

          inputRef.current?.focus();
          inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
        }}
      >
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex gap-4 items-center w-full">
            <input
              ref={inputRef}
              className={cn(
                "relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none text-sm px-3 py-1.5 border-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md shadow-sm ring-1 ring-inset  dark:ring-gray-700 focus:ring-2  placeholder:text-gray-400 dark:placeholder:text-gray-500",
                formErrors?.title && Array.isArray(formErrors?.title)
                  ? "ring-red-400 focus:ring-red-500 dark:focus:ring-red-400"
                  : "ring-gray-300 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              )}
              type="text"
              name="title"
              autoFocus
              placeholder="Eat, sleep, code"
              required
            />

            <input
              type="hidden"
              name="_currentFilter"
              defaultValue={currentFilter}
              readOnly
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
          {formErrors?.title && Array.isArray(formErrors?.title) && (
            <ul
              aria-live="assertive"
              className="pl-0 text-red-400 text-sm m-0 py-2"
            >
              {formErrors?.title.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          )}
        </div>
      </form>
    </>
  );
}
