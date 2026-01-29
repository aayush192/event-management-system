import { prisma } from "../lib/prisma";
//user registration
export const userRegistrationServices = async (user, id) => {
    if (!user && !id)
        throw new Error("userId or EventId missing");
    try {
        const checkEventStatus = await prisma.event.findUnique({
            where: {
                id: id,
            },
        });
        if (checkEventStatus?.status !== "APPROVED") {
            throw new Error(`Event is not approved`);
        }
        const userRegistration = await prisma.registration.create({
            data: {
                userId: user.id,
                eventId: id,
            },
        });
        console.log(userRegistration);
        return userRegistration;
    }
    catch (error) {
        throw new Error(`error:${error}`);
    }
};
//user unregistration
export const userUnregistrationServices = async (user, id) => {
    if (!user && !id)
        throw new Error("userId or EventId missing");
    try {
        const userUnregistration = await prisma.registration.delete({
            where: {
                userId_eventId: {
                    userId: user.id,
                    eventId: id,
                },
            },
        });
        console.log(userUnregistration);
        return userUnregistration;
    }
    catch (error) {
        throw new Error(`${error}`);
    }
};
//get event registered
export const getRegisteredEventServices = async (userId, user, page, offset) => {
    try {
        if (user.role !== "ADMIN" && user.id !== userId)
            throw new Error(`user is not allowed`);
        const skip = (page - 1) * offset;
        const getRegisteredEvent = await prisma.registration.findMany({
            skip,
            take: offset,
            where: {
                userId: userId,
            },
            include: { event: true },
        });
        console.log(getRegisteredEvent);
        return getRegisteredEvent;
    }
    catch (error) {
        throw new Error(`${error}`);
    }
};
