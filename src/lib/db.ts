import { PrismaClient } from "@prisma/client";

// A single PrismaClient per process. In dev, Next's hot-reload re-evaluates
// modules on every change; without this guard each reload would open a new
// pool and eventually exhaust Supabase's connection limit. We stash the client
// on globalThis so reloads reuse it.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
