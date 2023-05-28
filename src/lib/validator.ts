import { preprocess, z } from "zod";
import { zfd } from "zod-form-data";

export const todoCreateSchema = zfd.formData({
  title: zfd.text(),
  dueDate: preprocess((dateStr) => new Date(dateStr as string), z.date())
    .optional()
    .default(() => new Date()),
});

export const todoFilterSchema = z
  .enum(["completed", "uncompleted"])
  .optional()
  .catch(undefined);
