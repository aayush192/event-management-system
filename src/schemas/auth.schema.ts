import z, { date, optional } from "zod";
import { userSchema } from "./user.schema";

export const paginationSchema = z.object({
  page: z.coerce.number().int().optional(),
  offset: z.coerce.number().int().optional(),
});

export const searchEventSchema = paginationSchema.extend({
  search: z.string().optional(),
});

export const registerUserSchema = userSchema
  .omit({
    id: true,
    email: true,
    role: true,
  })
  .extend({
    password: z
      .string()
      .regex(/[a-z]/, "Must constain one small letter")
      .regex(/[A-Z]/, "must contain one capital letter")
      .regex(/[0-9]/, "Must contain one number")
      .regex(/[@#$&*!?]/, "Must contain one special character")
      .min(8, "password must contain 8 characters")
      .max(16, "password must be at most 16 character long"),

    confirm_password: z.string(),
    dob: z.coerce.date(),
    phoneNo: z.string(),
    description: z.string().optional(),
  })
  .refine((data) => data.confirm_password === data.password, {
    message: "Password didn't match",
    path: ["confirmPassword"],
  });

export const loginSchema = userSchema
  .omit({
    id: true,
    name: true,
    role: true,
  })
  .extend({
    password: z.string().min(8, { message: "password must have 8 characters" }),
  });

export const valiadateEnv = z.object({
  DATABASE_URL: z.url().nonempty("database url can't be empty"),
  JWT_SECRET: z.string().nonempty("jwt token secret can't be empty"),
  PORT: z.string().nonempty("port can't be empty"),
  JWT_EXPIRES_IN: z.string().nonempty("token expire time must be provided"),
  JWT_REFRESH_TOKEN_SECRET_KEY: z
    .string()
    .nonempty("jwt refresh token secret key can't be empty"),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z
    .string()
    .nonempty("jwt refresh token expire time can't be empty"),
  CLOUDINARY_CLOUD_NAME: z
    .string()
    .nonempty("cloudinary cloud name can't be empty"),
  CLOUDINARY_API_KEY: z.string().nonempty("cloudinary api key can't be empty"),
  CLOUDINARY_API_SECRET: z
    .string()
    .nonempty("cloudinary api secret can't be empty"),
  EMAIL: z.email().nonempty("email can't be empty"),
  PASSWORD: z.string().nonempty("password can't cn't be empty"),

  REDIS_HOST: z.string().nonempty("redis host can't be empty"),
  REDIS_PORT: z.string().nonempty("redis port can't be empty"),
  JWT_VALIDATE_SECRET: z.string().nonempty("jwt secret key can't be empty"),
  JWT_VALIDATE_TOKEN_EXPIRES_IN: z
    .string()
    .nonempty("jwt token expire time can't be empty"),
});

export const changePasswordSchema = z
  .object({
    old_password: z.string(),
    new_password: z
      .string()
      .regex(/[a-z]/, "Must constain one small letter")
      .regex(/[A-Z]/, "must contain one capital letter")
      .regex(/[0-9]/, "Must contain one number")
      .regex(/[@#$&*!?]/, "Must contain one special character")
      .min(8, "password must contain 8 characters")
      .max(16, "password must be at most 16 character long"),
    confirm_password: z.string(),
  })
  .refine((data) => data.confirm_password === data.new_password, {
    message: "Password doesn't match",
    path: ["confirmPassword"],
  });

export const verifyOtpSchema = z.object({
  otp: z.string(),
  email: z.string(),
});

export const getTokenSchema = z.object({
  email: z.string(),
  role: z.enum(["organizer", "user"]),
});

export const resetTokenSchema = z.object({
  email: z.string(),
  payloadType: z.string(),
});

export const resetPasswordSchema = z
  .object({
    new_password: z
      .string()
      .regex(/[a-z]/, "Must constain one small letter")
      .regex(/[A-Z]/, "must contain one capital letter")
      .regex(/[0-9]/, "Must contain one number")
      .regex(/[@#$&*!?]/, "Must contain one special character")
      .min(8, "password must contain 8 characters")
      .max(16, "password must be at most 16 character long"),
    confirm_password: z.string(),
  })
  .refine((data) => data.confirm_password === data.new_password, {
    message: "Password doesn't match",
    path: ["confirmPassword"],
  });

export const refreshTokenSchema = z.object({
  id: z.string(),
});

export type getTokenType = z.infer<typeof getTokenSchema>;

export type registerUserType = z.infer<typeof registerUserSchema>;

export type loginType = z.infer<typeof loginSchema>;

export type changePasswordType = z.infer<typeof changePasswordSchema>;

export type verifyOtpType = z.infer<typeof verifyOtpSchema>;

export type getOtpType = z.infer<typeof getTokenSchema>;

export type resetTokenType = z.infer<typeof resetTokenSchema>;

export type refreshTokenType = z.infer<typeof refreshTokenSchema>;

export type resetPasswordType = z.infer<typeof resetPasswordSchema>;

export type paginationType = z.infer<typeof paginationSchema>;
