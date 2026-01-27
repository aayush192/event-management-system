import cron from "node-cron";
import { prisma } from "../lib/prisma";
cron.schedule("* */1 * * *", async () => {
  const deleteOtp = await prisma.otp.deleteMany({
    where: {
      OR: [{ isUsed: true }, { expiresAt: { lt: new Date() } }],
    },
  });
});
