import { prisma } from "../lib/prisma";
export const checkRoleUtility = async (role: string) => {
  const checkRole = await prisma.role.findUnique({
    where: {
      role: role,
    },
  });
  if (!checkRole) throw new Error(`invalid roleId`);
  return checkRole;
};
