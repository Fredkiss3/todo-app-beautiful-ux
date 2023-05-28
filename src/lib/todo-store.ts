import { create } from "zustand";
import type { Todo } from "~/app/(models)/todos";

type TodoStore = {
  items: Array<Todo & { isOptimistic?: boolean }>;
  addTodo: (newItem: Todo) => void;
};

export const useTodoStore = create<TodoStore>((set) => ({
  items: [],
  addTodo: (newItem) =>
    set((store) => ({
      items: [
        ...store.items,
        {
          ...newItem,
          isOptimistic: true,
        },
      ],
    })),
}));
