import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  const name = process.env.ADMIN_NAME;
  const phone = process.env.ADMIN_PHONE;
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !phone || !password) {
    throw new Error(
      "ADMIN_NAME, ADMIN_PHONE, and ADMIN_PASSWORD must be set."
    );
  }

  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters long.");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: {
      phone,
    },
    update: {
      name,
      password: hashedPassword,
      role: "ADMIN",
      isActive: true,
    },
    create: {
      name,
      phone,
      password: hashedPassword,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log(`Admin account ready: ${admin.phone}`);
}

main()
  .catch((error) => {
    console.error("Failed to create admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });