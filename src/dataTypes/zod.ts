import z, { date, optional } from "zod";
import { omit } from "zod/v4/core/util.cjs";

export const createEventSchema = z.object({
  name: z.string().min(1, { message: "you must provide a name" }),
  description: z.string(),
  eventdate: z.coerce.date(),
  category: z.enum([
    "CONFERENCE",
    "WORKSHOP",
    "MEETUP",
    "WEBINAR",
    "SEMINAR",
    "SOCIAL",
    "SPORTS",
    "MUSIC",
    "OTHER",
  ]),
});

export const searchEventSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  eventdate: z.date().optional(),
  page: z.coerce.number().int().optional(),
  offset: z.coerce.number().int().optional(),
});

export const updateEventStatusSchema = z.object({
  id: z.string(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().optional(),
  offset: z.coerce.number().int().optional(),
});

export const registerUserSchema = userSchema.omit({ id: true }).extend({
  password: z
    .string()
    .min(8, { message: "password must contain 8 characters" }),
  dob: z.coerce.date(),
  phoneNo: z.string(),
  description: z.string().optional(),
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

export const updateUserSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().optional(),
    roleId: z.string().optional(),
  })
  .refine((data) => !data.email || !data.name || !data.roleId, {
    message: "at least one value must be provided to update",
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
});

export const changePasswordSchema = z.object({
  old_password: z.string(),
  new_password: z.string(),
});

export const verifyOtpSchema = z.object({
  otp: z.string(),
  email: z.string(),
});

export const getTokenSchema = z.object({
  email: z.string(),
});

export const resetTokenSchema = z.object({
  email: z.string(),
  payloadType: z.string(),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string(),
});

export const updateProfileSchema = z.object({
  dob: z.date().optional(),
  phoneNo: z.string().optional(),
  description: z.string().optional(),
});

export const statusSchema = z.object({
  status: z.enum(["APPROVED", "PENDING", "REJECTED"]),
});

export const userIdSchema = z.object({
  userId: z.uuid("uuid invalid"),
});
export const eventIdSchema = z.object({
  eventId: z.uuid("uuid invalid"),
});
export const eventImageIdSchema = z.object({
  eventImageId: z.uuid("uuid invalid"),
});

export const refreshTokenSchema = z.object({
  id: z.string(),
});

const searchEventOmittedSchema = searchEventSchema.omit({
  page: true,
  offset: true,
});

export const updateEventSchema = createEventSchema
  .partial()
  .refine(
    (data) =>
      data.category || !data.description || !data.eventdate || !data.name,
    {
      message: "at least one data must be provided",
    }
  );

export type getTokenType = z.infer<typeof getTokenSchema>;

export type createEventType = z.infer<typeof createEventSchema>;

export type searchEventType = z.infer<typeof searchEventOmittedSchema>;

export type updateEventStatusType = z.infer<typeof updateEventStatusSchema>;

export type updateEventType = z.infer<typeof updateEventSchema>;

export type status = "PENDING" | "APPROVED" | "REJECTED";

export type userType = z.infer<typeof userSchema>;

export type registerUserType = z.infer<typeof registerUserSchema>;

export type loginType = z.infer<typeof loginSchema>;

export type updateUserType = z.infer<typeof updateUserSchema>;

export type changePasswordType = z.infer<typeof changePasswordSchema>;

export type verifyOtpType = z.infer<typeof verifyOtpSchema>;

export type getOtpType = z.infer<typeof getTokenSchema>;

export type resetTokenType = z.infer<typeof resetTokenSchema>;

export type refreshTokenType = z.infer<typeof refreshTokenSchema>;

export type resetPasswordType = z.infer<typeof resetPasswordSchema>;

export type updateProfileType = z.infer<typeof updateProfileSchema>;
