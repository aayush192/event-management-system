import { prisma } from "../config/prisma.config";
import apiError from "../utils/apiError.utils";
import { cloudianryUploadImage, cloudinaryGetImage, cloudinaryRemoveImage, } from "../utils/cloudinary.utils";
import { pagination } from "../utils/pagination.utils";
import { checkRoleUtility } from "../utils/roleCheck.utils";
//get me
export const getMeServices = async (user) => {
    const getUserData = await prisma.user.findUnique({
        select: {
            id: true,
            name: true,
            email: true,
            roleId: true,
            profile: true,
            registrations: true,
        },
        where: {
            id: user.id,
        },
    });
    if (getUserData?.profile?.publicId) {
        return {
            ...getUserData,
            profile: {
                ...getUserData.profile,
                imageUrl: cloudinaryGetImage(getUserData.profile.publicId),
            },
        };
    }
    return getUserData;
};
//get user by id
export const getUserByIdServices = async (id) => {
    const user = await prisma.user.findUnique({
        select: {
            id: true,
            name: true,
            email: true,
            roleId: true,
            profile: true,
            registrations: {
                include: { event: true },
            },
        },
        where: {
            id: id,
        },
    });
    if (user?.profile?.publicId) {
        return {
            ...user,
            profile: {
                ...user.profile,
                imageUrl: cloudinaryGetImage(user.profile.publicId),
            },
        };
    }
    return user;
};
//get users
export const getUserServices = async (page, pageSize) => {
    const { currentPage, skip, take } = pagination(page, pageSize);
    const [user, totalUser] = await prisma.$transaction([
        prisma.user.findMany({
            skip,
            take,
            select: {
                id: true,
                name: true,
                email: true,
                roleId: true,
                profile: true,
            },
        }),
        prisma.user.count(),
    ]);
    if (!user)
        throw new apiError(404, "failed to get User");
    const userWithProfile = user.map((user) => {
        if (user.profile?.publicId) {
            return {
                ...user,
                profile: {
                    ...user.profile,
                    imageUrl: cloudinaryGetImage(user.profile.publicId),
                },
            };
        }
        else {
            return user;
        }
    });
    console.log(userWithProfile);
    const totalPage = totalUser / take;
    return {
        data: userWithProfile,
        meta: {
            page: currentPage,
            pageSize: take,
            totalCount: totalUser,
            totalPage: Math.ceil(totalPage),
            hasNext: currentPage < totalPage,
            hasPrevious: currentPage > 1,
        },
    };
};
export const getRegisteredUserServices = async (eventId, user, page, pageSize) => {
    const { currentPage, skip, take } = pagination(page, pageSize);
    if (user.role === "ORGANIZER") {
        const checkEvent = await prisma.event.findUnique({
            where: {
                id: eventId,
            },
        });
        if (!checkEvent)
            throw new apiError(404, `failed to get events`);
        else if (checkEvent.userId !== user.id) {
            throw new Error(`event is not organized by ${user.name}`);
        }
    }
    const [registeredUser, totalRegisteredUser] = await prisma.$transaction([
        prisma.registration.findMany({
            skip,
            take,
            where: {
                eventId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profile: true,
                    },
                },
            },
        }),
        prisma.registration.count({
            where: {
                eventId,
            },
        }),
    ]);
    if (!registeredUser)
        throw new apiError(404, "user not available");
    const registeredUserWithProfile = registeredUser.map((user) => {
        if (user.user.profile?.publicId)
            return {
                ...user,
                ...user.user.profile,
                imageUrl: cloudinaryGetImage(user.user.profile.publicId),
            };
    });
    const totalPage = totalRegisteredUser / take;
    return {
        data: registeredUserWithProfile,
        meta: {
            page: currentPage,
            pageSize: take,
            totalCount: totalRegisteredUser,
            totalPage: Math.ceil(totalPage),
            hasNext: currentPage < totalPage,
            hasPrevious: currentPage > 1,
        },
    };
};
//delete User
export const deleteUserServices = async (id, user) => {
    if (id !== user.id && user.role.toUpperCase() !== "ADMIN")
        throw new apiError(400, `user is not allowed to delete this account`);
    const checkUser = await prisma.user.findUnique({
        where: {
            id: id,
        },
    });
    if (!checkUser)
        throw new apiError(404, `failed to get user credentials`);
    const checkProfile = await prisma.profile.findFirst({
        where: {
            userId: user.id,
        },
    });
    if (checkProfile?.publicId) {
        await cloudinaryRemoveImage(checkProfile.publicId);
        const deleteProfileImage = await prisma.profile.update({
            where: {
                userId: user.id,
            },
            data: {
                publicId: null,
            },
        });
    }
    const deleteUser = await prisma.user.delete({
        where: {
            id: id,
        },
        omit: {
            password: true,
        },
    });
};
export const updateUserServices = async (user, data) => {
    if (data.roleId !== undefined) {
        const checkRole = await checkRoleUtility(data.roleId);
        if (checkRole.role === "admin")
            throw new apiError(403, "admin role is not allowed to choose");
    }
    const updateUser = await prisma.user.update({
        where: {
            id: user.id,
        },
        data,
    });
    if (!updateUser)
        throw new apiError(500, "can't update the user");
    return updateUser;
};
export const updateProfileImageServices = async (file, user) => {
    if (!file)
        throw new apiError(400, "file path missing");
    const profileData = await prisma.profile.findFirst({
        where: {
            userId: user.id,
        },
    });
    if (!profileData)
        throw new apiError(400, "profile of this user doesnot exist");
    if (profileData.publicId) {
        await cloudinaryRemoveImage(profileData.publicId);
    }
    const cloudinaryUpload = await cloudianryUploadImage(file.path);
    const updateImage = await prisma.profile.update({
        where: {
            userId: user.id,
        },
        data: {
            publicId: cloudinaryUpload.public_id,
        },
    });
    if (!updateImage)
        throw new apiError(500, "error while updating data");
    return updateImage;
};
export const deleteProfileImageServices = async (user) => {
    const checkProfile = await prisma.profile.findFirst({
        where: {
            userId: user.id,
        },
    });
    if (!checkProfile?.publicId)
        throw new apiError(404, "profile not found");
    await cloudinaryRemoveImage(checkProfile.publicId);
    const deleteProfileImage = await prisma.profile.update({
        where: {
            userId: user.id,
        },
        data: {
            publicId: null,
        },
    });
    if (!deleteProfileImage)
        throw new apiError(500, "error while deleting image");
    return deleteProfileImage;
};
export const updateProfileServices = async (data, user) => {
    if (!data.description && !data.dob && !data.phoneNo)
        throw new apiError(400, "data is missing");
    if (data.dob) {
        data.dob = new Date(data.dob);
    }
    const updateProfile = await prisma.profile.update({
        where: {
            userId: user.id,
        },
        data,
    });
    if (!updateProfile)
        throw new apiError(500, "error while updating profile");
    return updateProfile;
};
export const getOrganizerServices = async (page, pageSize) => {
    const { currentPage, take, skip } = pagination(page, pageSize);
    const role = await prisma.role.findFirst({
        where: {
            role: "organizer",
        },
    });
    const [getOrganizer, totalOrganizer] = await prisma.$transaction([
        prisma.user.findMany({
            skip,
            take,
            where: {
                roleId: role?.id,
            },
            include: {
                _count: {
                    select: {
                        events: {
                            where: {
                                status: "APPROVED",
                            },
                        },
                    },
                },
            },
            orderBy: {
                events: {
                    _count: "desc",
                },
            },
        }),
        prisma.user.count({
            where: {
                roleId: role?.id,
            },
        }),
    ]);
    const totalPage = totalOrganizer / take;
    return {
        data: getOrganizer,
        meta: {
            page: currentPage,
            pageSize: take,
            totalPage: Math.ceil(totalPage),
            totalCount: totalOrganizer,
            hasNext: currentPage < totalPage,
            hasPrevious: currentPage > 0,
        },
    };
};
