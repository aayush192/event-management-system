import z, { date, optional } from "zod";
import { omit } from "zod/v4/core/util.cjs";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
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

export const updateProfileSchema = z.object({
  dob: z.date().optional(),
  phoneNo: z.string().optional(),
  description: z.string().optional(),
});

export const userIdSchema = z.object({
  userId: z.uuid("uuid invalid"),
});

export type userType = z.infer<typeof userSchema>;


export type updateUserType = z.infer<typeof updateUserSchema>;


export type updateProfileType = z.infer<typeof updateProfileSchema>;
