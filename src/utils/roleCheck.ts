import { prisma } from "../lib/prisma";
export const checkRoleUtility = async (roleId: string) => {
  const checkRole = await prisma.role.findUnique({
    where: {
      id: roleId,
    },
  });
  if (!checkRole) throw new Error(`invalid roleId`);
  return checkRole;
};
