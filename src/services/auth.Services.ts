import bcrypt from "bcrypt";
import jwt, { Jwt, SignOptions } from "jsonwebtoken";
import { prisma } from "../config/prisma.config";
import config from "../config/config";
import apiError from "../utils/apiError.utils";
import { generateTokens } from "../utils/generateTokens.utils";
import { checkRoleUtility } from "../utils/roleCheck.utils";
import {
  changePasswordType,
  getTokenType,
  refreshTokenType,
  registerUserType,
  resetPasswordType,
  resetTokenType,
  userType,
} from "../schemas";
import {
  cloudianryUploadImage,
  sendMail,
  addMailInQueue,
  emailDetailUtils,
} from "../utils";
import crypto from "crypto";

interface loginType {
  email: string;
  password: string;
}
interface registerType{
  email: string;
  role:"organizer"|"user"
}
interface resetType{
  email: string;
}

//user login
export const authLoginServices = async (data: loginType) => {
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

  const { accessToken, refreshToken } = generateTokens({
    ...userData,
    role: getRole.role,
  } as userType);

  const storeRefreshToken = await prisma.user.update({
    where: {
      id: fetchedUserData.id,
    },
    data: {
      refreshToken: refreshToken,
    },
  });
  return { ...userData, accessToken, refreshToken };
};

//Register User
export const authRegisterServices = async (
  data: registerUserType,
  file: Express.Multer.File,
  token: string
) => {

  const decryptedToken = jwt.verify(token, config.JWT_VALIDATE_SECRET!) as registerType
  const checkIfExist = await prisma.mailToken.findUnique({
    where: {
      email_token_purpose: {
        email:decryptedToken.email,
        token,
        purpose: "REGISTER_USER",
      },
      expiresAt: { gt: new Date() },
      isUsed: false,
    },
  });
  const updateToken = await prisma.mailToken.update({
    where: {
      email_token_purpose: {
        email: decryptedToken.email,
        token,
        purpose: "REGISTER_USER",
      },
      isUsed: false,
    },
    data: {
      isUsed: true,
    },
  });

  const checkRole = await prisma.role.findFirst({
    where: {
      role: decryptedToken.role,
    },
  });
  if (!checkRole) throw new apiError(400, `role doesn't exist`);

  const hashedpasword = bcrypt.hashSync(data.password, 10);

  if (!file) throw new apiError(400, "failed to upload image");

  const cloudinaryUpload = await cloudianryUploadImage(file.path);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: decryptedToken.email,
      password: hashedpasword,
      roleId: checkRole.id,
      profile: {
        create: {
          dob: new Date(data.dob),
          phoneNo: data.phoneNo,
          description: data.description,
          publicId: cloudinaryUpload.public_id,
        },
      },
    },
    omit: {
      password: true,
      refreshToken: true,
      createdAt: true,
      updatedAt: true,
      roleId: true,
    },
  });
  const { accessToken, refreshToken } = generateTokens({
    ...user,
    role: decryptedToken.role,
  });

  const subject = "Welcome to EMS";
  const email = user.email; // the user's email
  const html = `<p>Hi Aayush,</p>

<p>Thank you for registering with EMS!</p>

<p>Your account has been successfully created. You can now log in and start exploring our features.</p>

<p>Welcome aboard!<br>
The EMS Team</p>
`;

  await addMailInQueue(email, subject, html);

  return { ...user, role:decryptedToken.role, accessToken, refreshToken };
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

//send mail for password reset
export const passwordResetMailServices = async (email: string) => {
  const checkUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!checkUser) throw new apiError(400, `user credentials doesn't match`);

  const token = jwt.sign({ email }, config.JWT_VALIDATE_SECRET!, {
    expiresIn:config.JWT_VALIDATE_TOKEN_EXPIRES_IN as SignOptions["expiresIn"] ||'10m'
  })
  const emailSubject = "Reset Password";
  const emailMessage =
    "We received a request to reset your password. Click the button below to set a new password. This link will expire in 10 minutes.";
  const baseUrl = `http://localhost:5173/resetpassword`;
  const purpose = "RESET_PASSWORD";
  const expiresAt=new Date(Date.now()+10*60*10)

  const storeToken = await prisma.mailToken.create({
    data: {
      token,
      email,
      purpose,
      expiresAt
    }
  })

  const info = emailDetailUtils(
    email,
    token,
    emailSubject,
    emailMessage,
    baseUrl,
    purpose
  );
  if (!info) throw new apiError(500, "unable to send otp");
  return info;
};

//send mail for registration
export const registerMailServices = async (data: getTokenType) => {
  const { email, role } = data;
  const checkUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (checkUser)
    throw new apiError(400, `user having this email already exist`);

  const token = jwt.sign({ email, role }, config.JWT_VALIDATE_SECRET!, {
    expiresIn:
      (config.JWT_VALIDATE_TOKEN_EXPIRES_IN as SignOptions["expiresIn"]) ||
      "10m",
  });

  const emailSubject = "User Registration";
  const emailMessage =
    "We received a request to create an account using this email address.To continue with registration, please verify your email by clicking the button below.";
  const baseUrl = `http://localhost:5173/register`;

  const purpose = "REGISTER_USER";
  const expiresAt = new Date(Date.now() + 10 * 60 * 10);

  const storeToken = await prisma.mailToken.create({
    data: {
      token,
      email,
      purpose,
      expiresAt,
    },
  });

  const info = emailDetailUtils(
    email,
    token,
    emailSubject,
    emailMessage,
    baseUrl,
    purpose
  );
  if (!info) throw new apiError(500, "failed to send otp");
  return info;
};

//reset password
export const resetPasswordServices = async (
  token: string,
  data: resetPasswordType
) => {
 
  const decryptedToken = jwt.verify(token,config.JWT_VALIDATE_SECRET!) as resetType
  const checkToken = await prisma.mailToken.findFirst({
    where: {
      token,
      isUsed: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!checkToken || checkToken.expiresAt < new Date())
    throw new apiError(400, "token already expired");

  const updateToken = await prisma.mailToken.update({
    where: {
      email_token_purpose: {
        email: checkToken?.email,
        token,
        purpose: "RESET_PASSWORD",
      },
      isUsed: false,
      expiresAt: { gt: new Date() },
    },
    data: {
      isUsed: true,
    },
  });

  const hashedPassword = bcrypt.hashSync(data.new_password, 10);
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
export const refreshAccessTokenServices = async (
  incomingRefreshToken: string
) => {
  if (!incomingRefreshToken) throw new apiError(400, "refresh Token missing");

  const token = jwt.verify(
    incomingRefreshToken,
    config.JWT_REFRESH_TOKEN_SECRET_KEY as jwt.Secret
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
    throw new apiError(400, "user having this token is not available");

  const getRole = await prisma.role.findUnique({
    where: {
      id: fetchedUserData.roleId,
    },
  });

  const { roleId, password, ...userData } = fetchedUserData;
  if (!getRole || !getRole.role) {
    throw new apiError(400, "Role not found");
  }

  const { accessToken, refreshToken } = generateTokens({
    ...userData,
    role: getRole.role,
  } as userType);
  const storeRefreshToken = await prisma.user.update({
    where: {
      id: fetchedUserData.id,
    },
    data: {
      refreshToken: refreshToken,
    },
  });

  return { accessToken, refreshToken };
};

export const logOutServices = async (token: string) => {
  const decoded = jwt.decode(token) as jwt.JwtPayload;
  const exp = decoded.exp!;
  console.log(exp);
  const blacklistToken = await prisma.blackList.create({
    data: {
      token: token,
      expiresAt: new Date(exp * 1000),
    },
  });
  if (!blacklistToken) throw new apiError(404, "LogOut failed");
};
