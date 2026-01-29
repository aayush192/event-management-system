import { admin } from "./seedingData";
import { prisma } from "../src/config/prisma";
import bcrypt from "bcrypt";
const seeding = async () => {
  const hashedPassword = bcrypt.hashSync(admin.password, 10);
  const adminRegister = await prisma.user.create({
    data: {
      name: admin.name,
      email: admin.email,
      roleId: admin.roleId,
      password: hashedPassword,
    },
  });
};

seeding()
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    prisma.$disconnect();
  });
