import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                data-slot="input"
                className={cn(
                    "h-11 w-full min-w-0  border border-input bg-secondary px-3 py-2 text-sm text-foreground outline-none transition-colors",
                    "placeholder:text-muted-foreground",
                    //   "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                    "disabled:pointer-events-none disabled:opacity-50",
                    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
                    className,
                )}
                ref={ref}
                {...props}
            />
        );
    },
);

Input.displayName = "Input";

export { Input };
