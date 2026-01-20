import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import config from "../config/config";
import apiError from "../utils/apiError";
import { checkRoleUtility } from "../utils/roleCheck";
import { changePasswordData, resetTokenData } from "../dataTypes/dataTypes";
import crypto from "crypto";
import { sendMail } from "../utils/email";

interface Data {
  name: string;
  roleId: string;
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

  if (!checkIfPasswordMatch)
    throw new apiError(400, "email or password doesn't match");

  if (!config.JWT_SECRET) {
    throw new apiError(500, "internal problem");
  }

  const token = jwt.sign(
    { id: User.id, name: User.name, email: User.email, roleId: User.roleId },
    config.JWT_SECRET,
    {
      expiresIn: config.JWT_EXPIRES_IN as SignOptions["expiresIn"] | "5d",
    }
  );

  const { password, ...userData } = User;
  return { data: { userData, token } };
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

  const checkRole = await checkRoleUtility(data.roleId);
  if (!checkRole) throw new apiError(400, `role doesn't exist`);
  if (checkRole.role === "admin")
    throw new apiError(401, `can't choose admin role`);
  const hashedpasword = await bcrypt.hashSync(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedpasword,
      roleId: data.roleId,
    },
  });

  const { password, ...userData } = data;
  return userData;
};

//change passswod
export const changePasswordServices = async (data: changePasswordData) => {
  const passwordCheck = await prisma.user.findFirst({
    where: {
      email: data.email,
    },
  });
  if (!passwordCheck) throw new apiError(500, `can't gey previous password`);
  const checkPassword = await bcrypt.compareSync(
    data.old_password,
    passwordCheck.password
  );
  if (!checkPassword) throw new apiError(400, `password doesn't match`);

  const hashedPassword = await bcrypt.hashSync(data.new_password, 10);

  const changePassword = await prisma.user.update({
    where: {
      email: data.email,
    },
    data: {
      password: hashedPassword,
    },
  });

  if (!changePassword) throw new apiError(500, `can't change password`);
  const { password, ...userData } = changePassword;
  return userData;
};

//get otp
export const getOtpServices = async (email: string) => {
  const checkUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (!checkUser) throw new apiError(400, `user with this email doesn't exist`);

  
  const deleteAny = await prisma.otp.deleteMany({
    where: {
      
          email: email
    
    },
  });
  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresIn = new Date(Date.now() + 5 * 60 * 1000);

  const hashedOtp = bcrypt.hashSync(otp, 10);

  const storeOtp = await prisma.otp.create({
    data: {
      hashedOtp: hashedOtp,
      email: email,
      expiresAt: expiresIn,
    },
  });

  const info = sendMail(email, expiresIn, otp);
  console.log(info);
  if (!info) throw new apiError(500, "unable to send otp");
  return info;
};

//verify otp
export const verifyOtpServices = async (otp: string, email: string) => {
  const findOtp = await prisma.otp.findFirst({
    where: {
      email,
    },
  });
  if (!findOtp) throw new apiError(404, `can't find otp for this email`);
  const checkDateTime = new Date(Date.now());
  if (checkDateTime > findOtp.expiresAt)
    throw new apiError(400, `opt is expired`);
  if (findOtp.isUsed) throw new apiError(400, `otp already used`);
  const checkOtp = bcrypt.compareSync(otp, findOtp.hashedOtp);
  if (!checkOtp) throw new apiError(400, `otp doesn't match`);

  const setOtpToUsed = await prisma.otp.update({
    where: {
      id: findOtp.id,
    },
    data: {
      isUsed: true,
    },
  });

  const resetToken = jwt.sign(
    { email: email, payloadType: "resetPassword" },
    config.JWT_SECRET as string,
    {
      expiresIn: "3m",
    }
  );

  return resetToken;
};

export const resetPasswordServices = async (
  resetToken: string,
  newPassword: string
) => {
  const data = jwt.verify(
    resetToken,
    config.JWT_SECRET as string
  ) as resetTokenData;
  console.log(data);
  if (data.payloadType !== "resetPassword")
    throw new apiError(400, `toke doesn't match`);
  const hashedPassword = await bcrypt.hashSync(newPassword, 10);
  const resetPassword = await prisma.user.update({
    where: {
      email: data.email,
    },
    data: {
      password: hashedPassword,
    },
  });

  const { password, ...userData } = resetPassword;
  return userData;
};
