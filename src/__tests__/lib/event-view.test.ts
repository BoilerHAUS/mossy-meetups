import { describe, expect, it } from "vitest";

import { getEventShareUrl, groupAttendeesByStatus } from "../../lib/event-view";

describe("getEventShareUrl", () => {
  it("builds an absolute event URL from the current origin", () => {
    expect(getEventShareUrl("https://mossymeetups.test", "event-42")).toBe(
      "https://mossymeetups.test/events/event-42"
    );
  });

  it("trims a trailing slash from the origin", () => {
    expect(getEventShareUrl("https://mossymeetups.test/", "event-42")).toBe(
      "https://mossymeetups.test/events/event-42"
    );
  });
});

describe("groupAttendeesByStatus", () => {
  it("returns attendees grouped by RSVP status", () => {
    const grouped = groupAttendeesByStatus([
      { userId: "1", status: "MAYBE", name: "Casey" },
      { userId: "2", status: "ATTENDING", name: "River" },
      { userId: "3", status: "NOT_ATTENDING", name: "Moss" },
      { userId: "4", status: "ATTENDING", name: "Fern" },
    ]);

    expect(grouped.going.map((attendee) => attendee.userId)).toEqual(["2", "4"]);
    expect(grouped.maybe.map((attendee) => attendee.userId)).toEqual(["1"]);
    expect(grouped.notGoing.map((attendee) => attendee.userId)).toEqual(["3"]);
  });
});
