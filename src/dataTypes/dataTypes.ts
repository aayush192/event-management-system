import z, { date } from "zod";
import { omit } from "zod/v4/core/util.cjs";

const data = z.object({
  name: z.string(),
  description: z.string(),
  eventdate: z.date(),
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

const searchEvent = z
  .object({
    name: z.string(),
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
    eventdate: z.date(),
  })
  .partial();

const updateEvent = z.object({
  id: z.string(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

const userDataType = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
  roleId: z.string(),
});

const registerdata = z.object({
  name: z.string(),
  email: z.string(),
  roleId: z.string(),
  password: z.string(),
});

const logindata = z.object({
  email: z.email(),
  password: z.string(),
});

const updateUser = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  roleId: z.string().optional(),
});

const changePasswordData = z.object({
  email: z.string(),
  old_password: z.string(),
  new_password: z.string(),
});

const verifyOtpData = z.object({
  otp: z.string(),
  email: z.string(),
});

const resetTokenData = z.object({
  email: z.string(),
  payloadType: z.string(),
});

const resetPasswordData = z.object({
  token: z.string(),
  newPassword: z.string(),
});

const uploadProfile = z.object({
  dob: z.date(),
  phoneNo: z.string(),
  description: z.string(),
  userId: z.string(),
});

const updateProfile = z.object({
  dob: z.date().optional(),
  phoneNo: z.string().optional(),
  description: z.string().optional(),
});

export type Data = z.infer<typeof data>;

export type searchEventType = z.infer<typeof searchEvent>;

export type updateEventData = z.infer<typeof updateEvent>;
export type Status = "PENDING" | "APPROVED" | "REJECTED";

export type UserType = z.infer<typeof userDataType>;

export type registerData = z.infer<typeof registerdata>;

export type loginData = z.infer<typeof logindata>;

export type updateData = z.infer<typeof updateUser>;

export type changePasswordData = z.infer<typeof changePasswordData>;

export type VerifyOtpData = z.infer<typeof verifyOtpData>;

export type getOtpData = Omit<VerifyOtpData, "otp">;

export type resetTokenData = z.infer<typeof resetTokenData>;

export type resetPasswordData = z.infer<typeof resetPasswordData>;

export type uploadProfile = z.infer<typeof uploadProfile>;

export type updateProfile = z.infer<typeof updateProfile>;
