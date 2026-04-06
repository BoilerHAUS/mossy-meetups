import { Button } from "@boilerhaus-ui/boilerhaus-ui";

interface CalendarExportButtonProps {
  href: string;
  label?: string;
  fullWidth?: boolean;
}

export function CalendarExportButton({
  href,
  label = "Add to calendar",
  fullWidth = false,
}: CalendarExportButtonProps) {
  return (
    <Button
      asChild
      variant="secondary"
      style={fullWidth ? { width: "100%" } : undefined}
    >
      <a href={href} download>{label}</a>
    </Button>
  );
}
