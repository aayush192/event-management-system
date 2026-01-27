import bcrypt from "bcrypt";
import jwt, { Jwt, SignOptions } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import config from "../config/config";
import apiError from "../utils/apiError";
import { checkRoleUtility } from "../utils/roleCheck";
import {
  changePasswordType,
  refreshTokenType,
  resetTokenType,
  userType,
} from "../dataTypes/dataTypes";
import crypto from "crypto";
import { sendMail } from "../utils/email";

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

const generateTokens = (User: userType) => {
  if (!config.JWT_SECRET || !config.JWT_REFRESH_TOKEN_EXPIRES_IN) {
    throw new apiError(500, "jwt config missing");
  }

  const newAccessToken = jwt.sign(
    { id: User.id, name: User.name, email: User.email, role: User.role },
    config.JWT_SECRET,
    {
      expiresIn: config.JWT_EXPIRES_IN as SignOptions["expiresIn"] | "1d",
    }
  );

  const newRefreshToken = jwt.sign(
    {
      id: User.id,
    },
    config.JWT_SECRET,
    {
      expiresIn: config.JWT_REFRESH_TOKEN_EXPIRES_IN as
        | SignOptions["expiresIn"]
        | "5d",
    }
  );

  return { newAccessToken, newRefreshToken };
};

//user login
export const authLoginServices = async (data: loginData) => {
  const fetchedUserData = await prisma.user.findFirst({
    select: {
      id: true,
      name: true,
      email: true,
      roleId: true,
      password: true,
    },
    where: {
      email: data.email,
    },
  });

  if (!fetchedUserData) throw new apiError(500, "user doesn't exist");

  const checkIfPasswordMatch = await bcrypt.compare(
    data.password,
    fetchedUserData.password
  );

  if (!checkIfPasswordMatch)
    throw new apiError(400, "user credentials doesn't match");

  const getRole = await prisma.role.findUnique({
    where: {
      id: fetchedUserData.roleId,
    },
  });

  const { roleId, password, ...userData } = fetchedUserData;
  if (!getRole) {
    throw new apiError(400, "Role not found");
  }

  const { newAccessToken, newRefreshToken } = generateTokens({
    ...userData,
    role: getRole.role,
  } as userType);

  const storeRefreshToken = await prisma.user.update({
    where: {
      id: fetchedUserData.id,
    },
    data: {
      refreshToken: newRefreshToken,
    },
  });
  return { data: { ...userData, newAccessToken, newRefreshToken } };
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

  // TODO: Get role and find in database if exist or not with role name.

  const checkRole = await prisma.role.findFirst({
    where: {
      role: data.role,
    },
  });
  if (!checkRole) throw new apiError(400, `role doesn't exist`);
  if (data.role.toLocaleLowerCase() === "admin")
    throw new apiError(401, `can't choose admin role`);
  const hashedpasword = bcrypt.hashSync(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedpasword,
      roleId: checkRole.id,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

//change passswod
export const changePasswordServices = async (
  user: userType,
  data: changePasswordType
) => {
  // Check Get User id from logged in token and use that to fetch user.
  const passwordCheck = await prisma.user.findFirst({
    where: {
      email: user.email,
    },
  });
  if (!passwordCheck) throw new apiError(500, `failed to get user credentials`);
  const checkPassword = bcrypt.compareSync(
    data.old_password,
    passwordCheck.password
  );
  if (!checkPassword) throw new apiError(400, `password doesn't match`);

  const hashedPassword = bcrypt.hashSync(data.new_password, 10);

  const changePassword = await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      password: hashedPassword,
    },
    omit: {
      password: true,
    },
  });

  return changePassword;
};

//get otp
export const getOtpServices = async (email: string) => {
  const checkUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!checkUser) throw new apiError(400, `user with this email doesn't exist`);

  const token = crypto.randomBytes(32).toString("hex");
  const expiresIn = new Date(Date.now() + 10 * 60 * 1000);
  console.log(token);
  const hashedToken = crypto.createHash("sha512").update(token).digest("hex");

  await prisma.otp.create({
    data: {
      hashedOtp: hashedToken,
      email: email,
      expiresAt: expiresIn,
    },
  });
  const subject = " reset password";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px;">
    <h2 style="color: #333; text-align: center;">Reset Password</h2>
    <p>Hello ${checkUser.name},</p>
    <p>We received a request to reset your password. Click the button below to set a new password. This link will expire in 10 minutes.</p>
    <p style="text-align: center;">
      <a href="https://localhost:8000/resetpassword?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: #fff; text-decoration: none; border-radius: 5px;">Secure Your Account</a>
    </p>
    <p>Thanks,<br/>Event Managaement System</p>
  </div>
</body>
</html>`;
  const info = await sendMail(email, subject, html);
  console.log(info);
  if (!info) throw new apiError(500, "unable to send otp");
  return info;
};

//verify otp
export const verifyOtpServices = async (otp: string, email: string) => {
  const findOtp = await prisma.otp.findFirst({
    where: {
      email,
      isUsed: false,
    },
  });
  if (!findOtp) throw new apiError(404, `can't find otp for this email`);
  const checkDateTime = new Date(Date.now());
  if (checkDateTime > findOtp.expiresAt)
    throw new apiError(400, `opt is expired`);
  if (findOtp.isUsed) throw new apiError(400, `otp already used`);
  const checkOtp = bcrypt.compareSync(otp, findOtp.hashedOtp);
  if (!checkOtp) throw new apiError(400, `otp doesn't match`);

  await prisma.otp.update({
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
  token: string,
  newPassword: string
) => {
  const hashedToken = crypto.createHash("sha512").update(token).digest("hex");

  const checkToken = await prisma.otp.findFirst({
    where: {
      hashedOtp: hashedToken,
      isUsed: false,
    },
  });
  console.log(token, checkToken);
  if (!checkToken || checkToken.expiresAt < new Date())
    throw new apiError(400, "token already expired");

  const hashedPassword = bcrypt.hashSync(newPassword, 10);
  const resetPassword = await prisma.user.update({
    where: {
      email: checkToken.email,
    },
    data: {
      password: hashedPassword,
    },
  });

  const { password, ...userData } = resetPassword;
  return userData;
};

//refreshAccessToken
export const refreshAccessTokenServices = async (refreshToken: string) => {
  if (!refreshToken) throw new apiError(400, "refresh Token missing");

  const token = jwt.verify(
    refreshToken,
    config.JWT_SECRET as jwt.Secret
  ) as refreshTokenType;

  const fetchedUserData = await prisma.user.findUnique({
    select: {
      id: true,
      name: true,
      email: true,
      roleId: true,
      password: true,
    },
    where: {
      id: token.id,
    },
  });

  if (!fetchedUserData)
    throw new apiError(400, "user having this token is missing");

  const getRole = await prisma.role.findUnique({
    where: {
      id: fetchedUserData.roleId,
    },
  });

  const { roleId, password, ...userData } = fetchedUserData;
  if (!getRole || !getRole.role) {
    throw new apiError(400, "Role not found");
  }

  const { newAccessToken, newRefreshToken } = generateTokens({
    ...userData,
    role: getRole.role,
  } as userType);
  const storeRefreshToken = await prisma.user.update({
    where: {
      id: fetchedUserData.id,
    },
    data: {
      refreshToken: newRefreshToken,
    },
  });

  return { newAccessToken, newRefreshToken };
};
