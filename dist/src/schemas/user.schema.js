import z from "zod";
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
