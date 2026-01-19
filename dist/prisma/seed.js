import { role } from "./role";
import { prisma } from "../src/lib/prisma";
const seedingRole = async () => {
    console.log("seeding");
    for (const r of role) {
        const Role = await prisma.role.create({
            data: {
                role: r,
            },
        });
    }
};
seedingRole()
    .catch((err) => {
    console.log(err);
    process.exit(1);
})
    .finally(async () => {
    prisma.$disconnect();
});
