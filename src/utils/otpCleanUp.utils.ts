import cron from "node-cron";
import { prisma } from "../config/prisma.config";
cron.schedule("0 * * * *", async () => {
  const deleteOtp = await prisma.mailToken.deleteMany({
    where: {
      OR: [{ isUsed: true }, { expiresAt: { lt: new Date() } }],
    },
  });
});
