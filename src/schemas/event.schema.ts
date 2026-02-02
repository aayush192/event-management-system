import z, { date, optional, string } from "zod";
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
  location: z.string(),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:MM format"),
});

export const categorySchema = z.enum([
  "CONFERENCE",
  "WORKSHOP",
  "MEETUP",
  "WEBINAR",
  "SEMINAR",
  "SOCIAL",
  "SPORTS",
  "MUSIC",
  "OTHER",
]);

export const filterEventSchema = z.object({
  name: z.string().optional(),
  category: z.preprocess(
    (val) => (typeof val === "string" ? val.toUpperCase() : val),
    categorySchema.optional()
  ),
  eventdate: z.date().optional(),
  page: z.coerce.number().int().optional(),
  offset: z.coerce.number().int().optional(),
});

export const updateEventStatusSchema = z.object({
  id: z.string(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

export const statusSchema = z.object({
  status: z.enum(["APPROVED", "PENDING", "REJECTED"]),
});

export const eventIdSchema = z.object({
  eventId: z.uuid("uuid invalid"),
});
export const eventImageIdSchema = z.object({
  eventImageId: z.uuid("uuid invalid"),
});

const searchEventOmittedSchema = filterEventSchema.omit({
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

const searchEventSchema = z.object({
  searchValue: z.string(),
});

export type searchEventType = z.infer<typeof searchEventSchema>[keyof z.infer<
  typeof searchEventSchema
>];

export type createEventType = z.infer<typeof createEventSchema>;

export type filterEventType = z.infer<typeof searchEventOmittedSchema>;

export type updateEventStatusType = z.infer<typeof updateEventStatusSchema>;

export type updateEventType = z.infer<typeof updateEventSchema>;

export type statusType = "PENDING" | "APPROVED" | "REJECTED";
