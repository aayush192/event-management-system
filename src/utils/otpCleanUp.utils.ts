import cron from "node-cron";
import { prisma } from "../config/prisma.config";
cron.schedule("0 0 * * *", async () => {
  const batchSize = 100;
  try {
    let hasMore = true;
    while (hasMore) {
      const tokens = await prisma.mailToken.findMany({
        where: {
          OR: [{ isUsed: true }, { expiresAt: { lt: new Date() } }],
        },
        take: batchSize,
        select: {
          id: true,
        },
      });

      const ids = tokens.map((token) => token.id);
      if (ids.length === 0) {
        hasMore = false;
        break;
      }

      await prisma.mailToken.deleteMany({
        where: {
          id: { in: ids },
        },
      });
    }
  } catch (err) {
    console.log("failed to clean the mail token");
  }

  try {
    let hasMore = true;
    while (hasMore) {
      const token = await prisma.blackList.findMany({
        where: {
          expiresAt: { lt: new Date() },
        },
        take: batchSize,
      });

      const ids = token.map((t) => t.id);
      if (ids.length === 0) {
        hasMore = false;
        break;
      }

      await prisma.blackList.deleteMany({
        where: {
          id: { in: ids },
        },
      });
    }
  } catch (err) {
    console.log("failed to clean the login token");
  }
});
