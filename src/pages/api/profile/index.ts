import { getServerSession } from "next-auth/next";
import type { NextApiRequest, NextApiResponse } from "next";

import { getAuthOptions } from "../../../lib/auth";
import { getPrismaClient } from "../../../lib/prisma";

type UpdateProfilePayload = {
  name?: string;
  phone?: string;
  hometown?: string;
  bio?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, getAuthOptions());
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const prisma = getPrismaClient();
  if (!prisma) {
    return res.status(503).json({ error: "DATABASE_URL is not configured" });
  }

  if (req.method === "GET") {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, phone: true, hometown: true, bio: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ success: true, data: user });
  }

  if (req.method === "PATCH") {
    const { name, phone, hometown, bio } = req.body as UpdateProfilePayload;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name?.trim() || null,
        phone: phone?.trim() || null,
        hometown: hometown?.trim() || null,
        bio: bio?.trim() || null,
      },
      select: { id: true, name: true, email: true, phone: true, hometown: true, bio: true },
    });

    return res.status(200).json({ success: true, data: user });
  }

  res.setHeader("Allow", "GET, PATCH");
  return res.status(405).json({ error: "Method not allowed" });
}
