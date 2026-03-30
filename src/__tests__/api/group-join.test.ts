import { describe, it, expect, vi, beforeEach } from "vitest";

import { mockReq, mockRes } from "../helpers";

vi.mock("next-auth/next", () => ({ getServerSession: vi.fn() }));
vi.mock("../../lib/prisma", () => ({ getPrismaClient: vi.fn() }));
vi.mock("../../lib/rate-limit", () => ({
  withRateLimit: (handler: unknown) => handler,
}));

import { getServerSession } from "next-auth/next";
import { getPrismaClient } from "../../lib/prisma";
import handler from "../../pages/api/groups/[id]/join";

const mockSession = { user: { id: "user-1", email: "alex@example.com" } };

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/groups/[id]/join", () => {
  it("returns 405 for non-POST methods", async () => {
    const req = mockReq({ method: "GET", query: { id: "g-1" } });
    const res = mockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(405);
  });

  it("returns 401 when there is no session", async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);
    vi.mocked(getPrismaClient).mockReturnValue({} as ReturnType<typeof getPrismaClient>);

    const req = mockReq({ query: { id: "g-1" } });
    const res = mockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(401);
  });

  it("returns 404 when the group does not exist", async () => {
    const prisma = {
      group: { findUnique: vi.fn().mockResolvedValue(null) },
    };
    vi.mocked(getServerSession).mockResolvedValue(mockSession);
    vi.mocked(getPrismaClient).mockReturnValue(prisma as ReturnType<typeof getPrismaClient>);

    const req = mockReq({ query: { id: "g-1" } });
    const res = mockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(404);
  });

  it("creates membership when the user joins a public group", async () => {
    const prisma = {
      group: { findUnique: vi.fn().mockResolvedValue({ id: "g-1", adminId: "other-user" }) },
      invite: {
        findFirst: vi.fn().mockResolvedValueOnce(null).mockResolvedValueOnce(null),
        create: vi.fn().mockResolvedValue({ id: "invite-1" }),
      },
    };
    vi.mocked(getServerSession).mockResolvedValue(mockSession);
    vi.mocked(getPrismaClient).mockReturnValue(prisma as ReturnType<typeof getPrismaClient>);

    const req = mockReq({ query: { id: "g-1" } });
    const res = mockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(prisma.invite.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          groupId: "g-1",
          userId: "user-1",
          email: "alex@example.com",
        }),
      })
    );
  });

  it("accepts an existing pending invite instead of creating a duplicate", async () => {
    const prisma = {
      group: { findUnique: vi.fn().mockResolvedValue({ id: "g-1", adminId: "other-user" }) },
      invite: {
        findFirst: vi
          .fn()
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce({ id: "invite-1" }),
        update: vi.fn().mockResolvedValue({ id: "invite-1" }),
      },
    };
    vi.mocked(getServerSession).mockResolvedValue(mockSession);
    vi.mocked(getPrismaClient).mockReturnValue(prisma as ReturnType<typeof getPrismaClient>);

    const req = mockReq({ query: { id: "g-1" } });
    const res = mockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(prisma.invite.update).toHaveBeenCalled();
  });
});
