import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import config from "../config/config";
import { error } from "node:console";
import { checkRoleUtility } from "../utils/roleCheck";

interface Data {
  name: string;
  role: string;
  email: string;
  password: string;
}
interface loginData {
  email: string;
  password: string;
}

//user login
export const authLoginServices = async (data: loginData) => {
  const User = await prisma.user.findFirst({
    where: {
      email: data.email,
    },
  });

  if (!User) throw new Error("user doesn't exist");

  const checkIfPasswordMatch = await bcrypt.compare(
    data.password,
    User.password
  );

  if (!checkIfPasswordMatch) throw new Error("email or password doesn't match");

  if (!config.JWT_SECRET) {
    throw new Error("internal problem");
  }

  const token = jwt.sign(
    { id: User.id, name: User.name, email: User.email, roleId: User.roleId },
    config.JWT_SECRET,
    {
      expiresIn: config.JWT_EXPIRES_IN as SignOptions["expiresIn"] | "5d",
    }
  );

  const { password, ...userData } = User;
  return { status: 200, data: { userData, token } };
};

//Register User

export const authRegisterServices = async (data: Data) => {
  const checkUserIfExist = await prisma.user.findFirst({
    where: {
      email: data.email,
    },
  });
  if (checkUserIfExist) throw new Error("user already exist");
  console.log(data);

  const checkRole = await checkRoleUtility(data.role);
  if (!checkRole) throw new Error(`role doesn't exist`);
  if (checkRole.role === "admin") throw new Error(`can't choose admin role`);
  const hashedpasword = await bcrypt.hashSync(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedpasword,
      roleId: checkRole.id,
    },
  });

  const { password, ...userData } = data;
  return userData;
};
