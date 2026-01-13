import { prisma } from "../lib/prisma";
export const getUserServices = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  if (user === null) return user;
  const { password, ...userData } = user;
  return userData;
};
