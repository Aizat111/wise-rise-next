import { Skeleton } from "@/components/ui/skeleton";

type PaymentHistorySkeletonProps = {
  label?: string;
};

export function PaymentHistorySkeleton({ label }: PaymentHistorySkeletonProps) {
  return (
    <div
      className="overflow-hidden rounded-xl border border-white/10"
      aria-busy
      aria-label={label}
    >
      <div className="min-w-[640px]">
        <div className="grid grid-cols-5 gap-3 border-b border-white/10 px-4 py-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={`payment-head-${index}`} className="h-4 w-24 bg-white/10" />
          ))}
        </div>
        {Array.from({ length: 4 }).map((_, row) => (
          <div
            key={`payment-row-${row}`}
            className="grid grid-cols-5 gap-3 border-b border-white/5 px-4 py-4 last:border-0"
          >
            {Array.from({ length: 5 }).map((_, col) => (
              <Skeleton
                key={`payment-cell-${row}-${col}`}
                className="h-4 w-full bg-white/10"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
