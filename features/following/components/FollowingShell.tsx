import { FOLLOWING_CONTAINER_CLASS } from "../constants";
import type { FollowingShellProps } from "../types";

export function FollowingShell({
  children,
}: FollowingShellProps) {
  return (
    <div className="bg-background text-foreground">
      <div className={FOLLOWING_CONTAINER_CLASS}>{children}</div>
    </div>
  );
}
