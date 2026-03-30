export type EventRsvpStatus = "ATTENDING" | "MAYBE" | "NOT_ATTENDING";

export interface EventAttendeeSummary {
  userId: string;
  status: EventRsvpStatus;
  name?: string | null;
  email?: string | null;
  hometown?: string | null;
}

export function getEventShareUrl(origin: string, eventId: string) {
  const path = `/events/${encodeURIComponent(eventId)}`;
  if (!origin) return path;
  return `${origin.replace(/\/$/, "")}${path}`;
}

export function groupAttendeesByStatus<T extends { status: EventRsvpStatus }>(attendees: T[]) {
  return {
    going: attendees.filter((attendee) => attendee.status === "ATTENDING"),
    maybe: attendees.filter((attendee) => attendee.status === "MAYBE"),
    notGoing: attendees.filter((attendee) => attendee.status === "NOT_ATTENDING"),
  };
}
