import { z } from "zod";

export const postGameSchema = z.object({
  title: z
    .string()
    .min(1, "Tên game không được để trống")
    .refine((value) => value.trim().length > 0, "Tên game không được để trống")
    .max(150, "Tên game tối đa 150 ký tự"),

  description: z
    .string()
    .max(2000, "Mô tả tối đa 2000 ký tự")
    .nullable()
    .optional(),

  price: z.coerce
    .number()
    .min(0, "Giá không được âm")
    .max(999, "Giá tối đa $999"),

  tagIds: z
    .array(z.string())
    .max(20, "Game chỉ được có tối đa 20 tag")
    .nullable()
    .optional(),
});

export type PostGameFormInput = z.input<typeof postGameSchema>;

export type PostGameFormOutput = z.output<typeof postGameSchema>;
