import { cn } from "@/lib/utils";
import { STATUS_LABELS, type ApplicationStatus } from "@/lib/core/domain/application";
import { STATUS_STYLES } from "@/lib/status-colors";

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        style.badge,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
      {STATUS_LABELS[status]}
    </span>
  );
}
