import { z } from "zod";

export const postGameSchema = z.object({
  title: z
    .string()
    .min(1, "Tên game không được để trống")
    .max(100, "Tên game tối đa 100 ký tự"),

  description: z
    .string()
    .max(2000, "Mô tả tối đa 2000 ký tự")
    .nullable()
    .optional(),

  price: z.coerce
    .number()
    .min(0, "Giá không được âm")
    .max(999, "Giá tối đa $999"),

  tagIds: z.array(z.string()).nullable().optional(),
});

export type PostGameFormInput = z.input<typeof postGameSchema>;

export type PostGameFormOutput = z.output<typeof postGameSchema>;
