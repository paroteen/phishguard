import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await hash("Admin1234!", 10);
  await prisma.user.upsert({
    where: { email: "admin@phishguard.local" },
    update: {},
    create: {
      email: "admin@phishguard.local",
      password: adminPassword,
      role: "admin"
    }
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
