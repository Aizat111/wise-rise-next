import type { CategoriesEmptyProps } from "./types";

export function CategoriesEmpty({ message }: CategoriesEmptyProps) {
  return (
    <div className="flex min-h-[160px] items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 text-center sm:min-h-[200px]">
      <p className="max-w-md text-sm text-white/65 sm:text-base">{message}</p>
    </div>
  );
}
