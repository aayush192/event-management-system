import { prisma } from "../config/prisma.config";
import { addMailInQueue } from "../utils";
import apiError from "../utils/apiError.utils";
import { pagination } from "../utils/pagination.utils";
//user registration
export const userRegistrationServices = async (user, id) => {
    const checkEventStatus = await prisma.event.findUnique({
        where: {
            id: id,
        },
    });
    if (checkEventStatus?.status !== "APPROVED") {
        throw new apiError(401, `Event is not approved`);
    }
    if (user.id === checkEventStatus.userId)
        throw new apiError(403, "forbidden to register in own event");
    const userRegistration = await prisma.registration.create({
        data: {
            userId: user.id,
            eventId: id,
        },
    });
    const email = user.email;
    const subject = `Event Registration Confirmation`;
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Event Registration Confirmation</title>
</head>
<body>
  <p>Hi ${user.name},</p>

  <p>Thank you for registering for the event: <strong>${checkEventStatus.name}</strong>.</p>

  <p><strong>Event Details:</strong></p>
  <ul>
    <li>Date: ${checkEventStatus.eventdate}</li>
    <li>Location: ${checkEventStatus.location}</li>
  </ul>

  <p>We look forward to seeing you!</p>

  <p>Regards,<br>EMS</p>
</body>
</html>
`;
    await addMailInQueue(email, subject, html);
    return userRegistration;
};
//user unregistration
export const deleteUserRegistrationServices = async (user, id) => {
    const deleteUserRegistration = await prisma.registration.delete({
        where: {
            userId_eventId: {
                userId: user.id,
                eventId: id,
            },
        },
    });
    if (!deleteUserRegistration)
        throw new apiError(500, "failed to delete user registration");
    return deleteUserRegistration;
};
//get event registered
export const getRegisteredEventServices = async (userId, user, page, pageSize) => {
    if (user.role !== "ADMIN" && user.id !== userId)
        throw new apiError(401, `unauthorized`);
    const { currentPage, skip, take } = pagination(page, pageSize);
    const [event, totalEvent] = await prisma.$transaction([
        prisma.registration.findMany({
            skip,
            take,
            where: {
                userId: userId,
            },
            include: { event: true },
        }),
        prisma.registration.count({
            where: {
                userId: userId,
            },
        }),
    ]);
    const totalPage = totalEvent / take;
    if (!event)
        throw new apiError(500, "failed to get registered event");
    return {
        event,
        pagination: {
            page: currentPage,
            pageSize: take,
            totalCount: totalEvent,
            totalPage,
            hasNext: currentPage < totalPage,
            hasPervious: currentPage > 1,
        },
    };
};
