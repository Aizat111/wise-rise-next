import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type InformationProseProps = {
  children: ReactNode;
  className?: string;
};

/** Shared typography for long-form information / legal content. */
export function InformationProse({ children, className }: InformationProseProps) {
  return (
    <div
      className={cn(
        "max-w-none space-y-6 text-sm leading-relaxed text-foreground/85 sm:text-base sm:leading-7",
        "[&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-foreground sm:[&_h2]:text-xl",
        "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground",
        "[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5",
        "[&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5",
        "[&_a]:text-primary [&_a]:underline-offset-2 hover:[&_a]:underline",
        className,
      )}
    >
      {children}
    </div>
  );
}
