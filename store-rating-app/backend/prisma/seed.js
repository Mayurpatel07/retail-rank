import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const passwordHash = await bcrypt.hash("Admin@123", 10);

await prisma.user.upsert({
  where: {
    email: "admin@storerating.com",
  },
  update: {},
  create: {
    name: "System Administrator Account",
    email: "admin@storerating.com",
    passwordHash,
    address: "System Address",
    role: "ADMIN",
  },
});

console.log("Admin account ready");

await prisma.$disconnect();