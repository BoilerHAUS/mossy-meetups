import { getServerSession } from "next-auth/next";
import type { NextApiRequest, NextApiResponse } from "next";

import { getAuthOptions } from "../../../lib/auth";
import { getPrismaClient } from "../../../lib/prisma";

function icsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function icsEscape(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function foldLine(line: string) {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  let i = 0;
  chunks.push(line.slice(0, 75));
  i = 75;
  while (i < line.length) {
    chunks.push(" " + line.slice(i, i + 74));
    i += 74;
  }
  return chunks.join("\r\n");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, getAuthOptions());
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const prisma = getPrismaClient();
  if (!prisma) {
    return res.status(503).json({ error: "DATABASE_URL is not configured" });
  }

  const events = await prisma.event.findMany({
    where: {
      arrivalDate: { not: null },
      group: {
        OR: [
          { adminId: session.user.id },
          { invites: { some: { userId: session.user.id, usedAt: { not: null } } } },
        ],
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      mapLink: true,
      arrivalDate: true,
      departureDate: true,
    },
    orderBy: {
      arrivalDate: "asc",
    },
  });

  if (events.length === 0) {
    return res.status(404).json({ error: "No confirmed events to export" });
  }

  const now = new Date();
  const eventLines = events.flatMap((event) => {
    if (!event.arrivalDate) return [];
    const dtEnd = event.departureDate ?? new Date(event.arrivalDate.getTime() + 86400000);

    return [
      "BEGIN:VEVENT",
      `UID:${event.id}@moss.boilerhaus.org`,
      `DTSTAMP:${icsDate(now)}`,
      `DTSTART:${icsDate(event.arrivalDate)}`,
      `DTEND:${icsDate(dtEnd)}`,
      `SUMMARY:${icsEscape(event.title)}`,
      event.description ? `DESCRIPTION:${icsEscape(event.description)}` : null,
      event.location ? `LOCATION:${icsEscape(event.location)}` : null,
      event.mapLink ? `URL:${event.mapLink}` : null,
      "END:VEVENT",
    ].filter(Boolean);
  });

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mossy Meetups//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...eventLines,
    "END:VCALENDAR",
  ]
    .map((line) => foldLine(line as string))
    .join("\r\n");

  res.setHeader("Content-Type", "text/calendar; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="mossy-meetups-events.ics"');
  return res.status(200).send(lines);
}
