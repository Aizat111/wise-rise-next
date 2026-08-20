import { ACTIVITIES_CONTAINER_CLASS } from "../constants";
import type { ActivitiesShellProps } from "../types";

export function ActivitiesShell({ children }: ActivitiesShellProps) {
  return (
    <div className="bg-background text-foreground">
      <div className={ACTIVITIES_CONTAINER_CLASS}>{children}</div>
    </div>
  );
}
