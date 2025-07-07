import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const client = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;
