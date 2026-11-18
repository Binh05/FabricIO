import { z } from "zod";

const emailSchema = z
  .string()
  .min(1, "Email không được để trống")
  .max(254, "Email không được vượt quá 254 ký tự")
  .email("Email không đúng định dạng");

const passwordSchema = z
  .string()
  .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
  .max(64, "Mật khẩu không được vượt quá 64 ký tự");

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username phải có ít nhất 3 ký tự")
    .max(30, "Username không được vượt quá 30 ký tự")
    .regex(/^[a-z0-9]+$/, "Username chỉ được gồm chữ thường và số"),
  fullName: z
    .string()
    .min(1, "Họ tên không được để trống")
    .refine((value) => value.trim().length > 0, "Họ tên không được để trống")
    .max(100, "Họ tên không được vượt quá 100 ký tự"),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
