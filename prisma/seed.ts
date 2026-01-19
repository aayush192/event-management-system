import { role, admin, operation, model } from "./seedingData";
import { prisma } from "../src/lib/prisma";
// import bcrypt from "bcrypt";

// const hashedPassword = bcrypt.hashSync(admin.password, 10);
// const adminRegister = await prisma.user.create({
//   data: {
//     name: admin.name,
//     email: admin.email,
//     roleId: admin.roleId,
//     password: hashedPassword,
//   },
// });
