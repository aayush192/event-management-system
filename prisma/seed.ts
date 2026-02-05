import { adminData, role } from "./seedingData";
import { prisma } from "../src/config/prisma.config";
import bcrypt from "bcrypt";
const seeding = async () => {
  const hashedPassword = bcrypt.hashSync(adminData.password, 10);
  for (const r of role) {
    const createRole = await prisma.role.upsert({
      where: { role: r },
      update: {},
      create: { role: r },
    });
  }
  const roleDetail = await prisma.role.findFirst({
    where: {
      role: adminData.role,
    },
  });
  const adminRegister = await prisma.user.upsert({
    where: { email: adminData.email },
    update:{},
    create: {
      name: adminData.name,
      email: adminData.email,
      roleId: roleDetail?.id!,
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
