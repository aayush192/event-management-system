import { Time } from "bullmq";
import { da } from "zod/v4/locales";

export const localToUtcTime = (date: string, time: string): Date => {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minutes] = time.split(":").map(Number);
  const localDate = new Date();
  localDate.setFullYear(year, month - 1, day);
  localDate.setHours(hour);
  localDate.setMinutes(minutes);

  const utcDate = new Date(
    localDate.getTime() - localDate.getTimezoneOffset() * 60000
  );
  return utcDate;
};
