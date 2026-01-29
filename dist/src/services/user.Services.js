import { prisma } from "../lib/prisma";
export const getUserByIdServices = async (id) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
            include: {
                registrations: { include: { event: true } },
            },
        });
        if (!user)
            return user;
        const { password, ...userData } = user;
        return userData;
    }
    catch (error) {
        throw new Error(`error occurred ${error}`);
    }
};
export const getUserServices = async (page, offset) => {
    try {
        const skip = (page - 1) * offset;
        const user = await prisma.user.findMany({
            skip: skip,
            take: offset,
        });
        if (!user)
            return user;
        console.log(user);
        const userData = user.map(({ password, ...rest }) => rest);
        console.log(JSON.stringify(userData));
        return userData;
    }
    catch (error) {
        throw new Error(`error occurred ${error}`);
    }
};
export const getRegisteredUserServices = async (eventId, user, page, offset) => {
    try {
        if (user.role === "ORGANIZER") {
            const checkEvent = await prisma.event.findUnique({
                where: {
                    id: eventId,
                },
            });
            if (!checkEvent)
                throw new Error(`event is not available`);
            else if (checkEvent.userId !== user.id) {
                throw new Error(`event is not organized by ${user.name}`);
            }
        }
        if (!eventId)
            throw new Error(`eventId is missing`);
        const skip = (page - 1) * offset;
        const getRegisteredUser = await prisma.registration.findMany({
            skip: skip,
            take: offset,
            where: {
                eventId: eventId,
            },
            include: {
                user: true,
            },
        });
        return getRegisteredUser;
    }
    catch (error) {
        throw new Error(` ${error}`);
    }
};
//delete User
export const deleteUserServices = async (id, user) => {
    try {
        if (id !== user.id && user.role !== "ADMIN")
            throw new Error(`user is not allowed to delete this account`);
        const checkUser = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        if (!checkUser)
            throw new Error(`user doesn't exist`);
        const deleteUser = await prisma.user.delete({
            where: {
                id: id,
            },
        });
        console.log(deleteUser);
        return deleteUser;
    }
    catch (error) {
        throw new Error(`${error}`);
    }
};
