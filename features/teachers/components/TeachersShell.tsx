import { InformationBreadcrumb } from "@/features/information";

import { TEACHERS_CONTAINER_CLASS } from "../constants";
import type { TeachersShellProps } from "../types";

export async function TeachersShell({
  title,
  homeLabel,
  children,
}: TeachersShellProps) {
  return (
    <div className="bg-background text-foreground">
      <div className={TEACHERS_CONTAINER_CLASS}>
        <header className="mb-8 min-w-0 sm:mb-10">
          <InformationBreadcrumb
            current={title}
            homeLabel={homeLabel}
            className="mt-0"
          />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
            {title}
          </h1>
        </header>
        {children}
      </div>
    </div>
  );
}
