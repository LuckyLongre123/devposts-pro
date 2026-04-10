// @ts-nocheck

let prismaInstance: any = null;

const initPrisma = () => {
  if (prismaInstance) return prismaInstance;

  try {
    const { PrismaClient } = require("@prisma/client");
    const { PrismaPg } = require("@prisma/adapter-pg");

    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });

    prismaInstance = new PrismaClient({
      adapter,
    });

    return prismaInstance;
  } catch (e) {
    // During build, return a stub to prevent errors
    console.warn("Prisma initialization skipped (build time)");
    return {
      $connect: () => Promise.resolve(),
      $disconnect: () => Promise.resolve(),
      post: { findMany: () => Promise.resolve([]) },
      like: { findFirst: () => Promise.resolve(null) },
      user: { findUnique: () => Promise.resolve(null) },
    };
  }
};

export default initPrisma();
