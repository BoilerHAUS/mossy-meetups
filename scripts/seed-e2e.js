#!/usr/bin/env node

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const testEmail = process.env.E2E_TEST_EMAIL || "e2e@example.com";

async function main() {
  const host = await prisma.user.create({
    data: {
      email: "host@example.com",
      name: "Host User",
      emailVerified: new Date(),
    },
  });

  const member = await prisma.user.create({
    data: {
      email: testEmail,
      name: "E2E Camper",
      emailVerified: new Date(),
      hometown: "Toronto",
    },
  });

  const group = await prisma.group.create({
    data: {
      name: "Longpoint Crew",
      adminId: host.id,
    },
  });

  await prisma.invite.create({
    data: {
      groupId: group.id,
      userId: member.id,
      email: testEmail,
      token: "seeded-e2e-invite-token",
      expiresAt: new Date("2030-01-01T00:00:00.000Z"),
      usedAt: new Date(),
    },
  });

  await prisma.event.create({
    data: {
      groupId: group.id,
      title: "Seeded Spring Camp",
      description: "A seeded event for Playwright auth and RSVP coverage.",
      location: "Turtle Dunes",
      mapLink: "https://maps.google.com/?q=Turtle+Dunes",
      arrivalDate: new Date("2026-06-12T14:00:00.000Z"),
      departureDate: new Date("2026-06-14T14:00:00.000Z"),
      nights: 2,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
