import { preprocess, z } from "zod";
import { zfd } from "zod-form-data";

export const schema = zfd.formData({
  title: zfd.text(),
  dueDate: preprocess(
    (dateStr) => new Date(dateStr as string),
    z.date()
  ).optional(),
});
