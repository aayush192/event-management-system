import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import config from "../config/config";
//user login
export const authLoginServices = async (data) => {
    const User = await prisma.user.findFirst({
        where: {
            email: data.email,
        },
    });
    if (!User)
        throw new Error("user doesn't exist");
    const checkIfPasswordMatch = await bcrypt.compare(data.password, User.password);
    if (!checkIfPasswordMatch)
        throw new Error("email or password doesn't match");
    if (!config.JWT_SECRET) {
        throw new Error("internal problem");
    }
    const token = jwt.sign({ id: User.id, name: User.name, email: User.email, role: User.role }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN,
    });
    const { password, ...userData } = User;
    return { status: 200, data: { userData, token } };
};
//Register User
export const authRegisterServices = async (data) => {
    const checkUserIfExist = await prisma.user.findFirst({
        where: {
            email: data.email,
        },
    });
    if (checkUserIfExist)
        throw new Error("user already exist");
    console.log(data);
    if (data.role === "ADMIN")
        throw new Error("Admin role is not allowed to choose");
    const hashedpasword = await bcrypt.hashSync(data.password, 10);
    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            role: data.role,
            password: hashedpasword,
        },
    });
    const { password, ...userData } = data;
    return userData;
};
