import { prisma } from "../lib/prisma";
export const getUserServices = async (id:number) => {
  const user = await prisma.user.findUnique({
    where: {
     id:id
    },
  });
    console.log(user);
  return (user);
};
