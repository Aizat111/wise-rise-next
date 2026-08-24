import * as React from "react";

import { cn } from "@/lib/utils";

type RadioProps = Omit<React.ComponentProps<"input">, "type"> & {
    label: React.ReactNode;
};

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
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
                    type="radio"
                    className={cn(
                        "mt-0.5 size-4 shrink-0 cursor-pointer border border-input bg-white/90 accent-primary",
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

Radio.displayName = "Radio";

export { Radio };