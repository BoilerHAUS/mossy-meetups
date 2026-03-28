-- Add arrival and departure date columns to Event
ALTER TABLE "Event" ADD COLUMN "arrivalDate" TIMESTAMP(3);
ALTER TABLE "Event" ADD COLUMN "departureDate" TIMESTAMP(3);

-- Drop the DateOption table (no longer needed)
DROP TABLE IF EXISTS "DateOption";
