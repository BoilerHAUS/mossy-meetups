import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";

import { getPrismaClient } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(getPrismaClient()!), // DATABASE_URL is required at runtime
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "database",
  },
};
