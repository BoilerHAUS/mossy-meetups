import { randomUUID } from "crypto";

import { getServerSession } from "next-auth/next";
import type { NextApiRequest, NextApiResponse } from "next";

import { getAuthOptions } from "../../../../lib/auth";
import { getPrismaClient } from "../../../../lib/prisma";
import { withRateLimit } from "../../../../lib/rate-limit";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, getAuthOptions());
  if (!session?.user?.id || !session.user.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const prisma = getPrismaClient();
  if (!prisma) {
    return res.status(503).json({ error: "DATABASE_URL is not configured" });
  }

  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid group ID" });
  }

  const group = await prisma.group.findUnique({
    where: { id },
    select: { id: true, adminId: true },
  });

  if (!group) {
    return res.status(404).json({ error: "Group not found" });
  }

  if (group.adminId === session.user.id) {
    return res.status(200).json({ success: true, alreadyMember: true });
  }

  const existingMembership = await prisma.invite.findFirst({
    where: { groupId: id, userId: session.user.id, usedAt: { not: null } },
    select: { id: true },
  });

  if (existingMembership) {
    return res.status(200).json({ success: true, alreadyMember: true });
  }

  const pendingInvite = await prisma.invite.findFirst({
    where: {
      groupId: id,
      usedAt: null,
      OR: [
        { userId: session.user.id },
        { email: session.user.email },
      ],
    },
    select: { id: true },
  });

  if (pendingInvite) {
    await prisma.invite.update({
      where: { id: pendingInvite.id },
      data: {
        userId: session.user.id,
        usedAt: new Date(),
      },
    });

    return res.status(200).json({ success: true, joined: true });
  }

  await prisma.invite.create({
    data: {
      groupId: id,
      userId: session.user.id,
      email: session.user.email,
      token: randomUUID(),
      expiresAt: new Date(),
      usedAt: new Date(),
    },
  });

  return res.status(200).json({ success: true, joined: true });
}

export default withRateLimit(handler);
