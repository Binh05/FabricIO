import { z } from "zod";

const MAX_GAME_SIZE = 50 * 1024 * 1024; // 50 MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

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

  sourceGame: z
    .any()
    .refine(
      (files: FileList) => files?.length > 0,
      "Vui lòng chọn file game (.zip / .apk)",
    )
    .refine(
      (files: FileList) => !files?.[0] || files[0].size <= MAX_GAME_SIZE,
      "File game tối đa 50 MB",
    ),

  thumbnail: z
    .any()
    .refine(
      (files: FileList) => files?.length > 0,
      "Vui lòng chọn ảnh đại diện",
    )
    .refine(
      (files: FileList) =>
        !files?.[0] || ACCEPTED_IMAGE_TYPES.includes(files[0].type),
      "Chỉ chấp nhận JPG, PNG, WEBP",
    )
    .refine(
      (files: FileList) => !files?.[0] || files[0].size <= MAX_IMAGE_SIZE,
      "Ảnh đại diện tối đa 10 MB",
    ),

  media: z
    .any()
    .optional()
    .nullable()
    .refine(
      (files: FileList | null | undefined) =>
        !files ||
        files.length === 0 ||
        Array.from(files).every((f) => ACCEPTED_IMAGE_TYPES.includes(f.type)),
      "Ảnh gallery chỉ chấp nhận JPG, PNG, WEBP",
    )
    .refine(
      (files: FileList | null | undefined) =>
        !files ||
        files.length === 0 ||
        Array.from(files).every((f) => f.size <= MAX_IMAGE_SIZE),
      "Mỗi ảnh gallery tối đa 10 MB",
    ),

  tagIds: z.array(z.string()).nullable().optional(),
});

export type PostGameFormInput = z.input<typeof postGameSchema>;

export type PostGameFormOutput = z.output<typeof postGameSchema>;
