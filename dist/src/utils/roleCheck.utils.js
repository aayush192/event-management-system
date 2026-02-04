import { prisma } from "../config/prisma.config.js";
export const checkRoleUtility = async (roleId) => {
    const checkRole = await prisma.role.findUnique({
        where: {
            id: roleId,
        },
    });
    if (!checkRole)
        throw new Error(`invalid roleId`);
    return checkRole;
};
