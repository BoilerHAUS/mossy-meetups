import { beforeEach, describe, expect, it, vi } from "vitest";

import { mockReq, mockRes } from "../helpers";

vi.mock("next-auth/next", () => ({ getServerSession: vi.fn() }));
vi.mock("../../lib/auth", () => ({
  getAuthOptions: vi.fn(() => ({})),
}));

import { getServerSession } from "next-auth/next";
import handler from "../../pages/api/weather";

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("fetch", vi.fn());
});

describe("GET /api/weather", () => {
  it("returns 405 for non-GET methods", async () => {
    const req = mockReq({ method: "POST" });
    const res = mockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(405);
  });

  it("returns 401 when no session exists", async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);
    const req = mockReq({
      method: "GET",
      query: { location: "Toronto", date: "2026-04-01" },
    });
    const res = mockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(401);
  });

  it("returns 400 when date is missing", async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: "u-1" } } as never);
    const req = mockReq({
      method: "GET",
      query: { location: "Toronto" },
    });
    const res = mockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({ error: "date is required" });
  });

  it("returns 400 when endDate is before date", async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: "u-1" } } as never);
    const req = mockReq({
      method: "GET",
      query: {
        location: "Toronto",
        date: "2026-04-02",
        endDate: "2026-04-01",
      },
    });
    const res = mockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({ error: "endDate must be on or after date" });
  });

  it("returns transformed multi-day forecast data for a location query", async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: "u-1" } } as never);
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [{ latitude: 43.65, longitude: -79.38 }],
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          daily: {
            time: ["2026-04-01", "2026-04-02", "2026-04-03"],
            weathercode: [0, 61, 95],
            temperature_2m_max: [11, 8, 6],
            temperature_2m_min: [3, 2, -1],
          },
        }),
      } as Response);

    const req = mockReq({
      method: "GET",
      query: {
        location: "Toronto",
        date: "2026-04-01",
        endDate: "2026-04-03",
      },
    });
    const res = mockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      success: true,
      data: [
        { date: "2026-04-01", condition: "sunny", temperatureC: 7, temperatureF: 45 },
        { date: "2026-04-02", condition: "rainy", temperatureC: 5, temperatureF: 41 },
        { date: "2026-04-03", condition: "stormy", temperatureC: 3, temperatureF: 37 },
      ],
    });
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
