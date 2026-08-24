import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type GiftFieldProps = {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

export function GiftField({ id, label, error, className, children }: GiftFieldProps) {
  const errorId = `${id}-error`;
  const describedBy = error ? errorId : undefined;

  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-white/90">
          {label}
        </label>
      ) : null}
      {Children.map(children, (child) => {
        if (!isValidElement(child)) return child;
        if (typeof child.type !== "string") return child;
        return cloneElement(child as ReactElement<{ "aria-describedby"?: string }>, {
          "aria-describedby": describedBy,
        });
      })}
      {error ? (
        <p id={errorId} className="text-sm text-red-500" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
