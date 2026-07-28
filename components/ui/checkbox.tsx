import * as React from "react";

import { cn } from "@/lib/utils";

type CheckboxProps = Omit<React.ComponentProps<"input">, "type"> & {
  label: React.ReactNode;
};

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputId = id ?? React.useId();

    return (
      <label
        htmlFor={inputId}
        className="flex cursor-pointer items-start gap-3 text-sm text-white/85"
      >
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className={cn(
            "mt-0.5 size-4 shrink-0 cursor-pointer rounded border border-input bg-white/90 checked:bg-primary accent-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        />
        <span className="leading-relaxed">{label}</span>
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
