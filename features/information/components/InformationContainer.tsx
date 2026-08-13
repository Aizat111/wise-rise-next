import { cn } from "@/lib/utils";

import { INFORMATION_CONTAINER_CLASS } from "../constants";
import type { InformationContainerProps } from "../types";

export function InformationContainer({
  children,
  className,
  as: Tag = "div",
}: InformationContainerProps) {
  return (
    <Tag className={cn(INFORMATION_CONTAINER_CLASS, className)}>{children}</Tag>
  );
}
