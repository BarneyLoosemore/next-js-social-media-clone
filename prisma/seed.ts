import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const encryptedPassword = await hash("password1234", 12);
  await prisma.user.upsert({
    where: { name: "Anna" },
    update: {},
    create: {
      name: "Anna",
      password: encryptedPassword,
    },
  });

  await prisma.user.upsert({
    where: { name: "Bob" },
    update: {},
    create: {
      name: "Bob",
      password: encryptedPassword,
    },
  });

  await prisma.user.upsert({
    where: { name: "Carl" },
    update: {},
    create: {
      name: "Carl",
      password: encryptedPassword,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
