export default function HediyeEtLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
      <div className="h-72 w-full animate-pulse rounded-2xl bg-white/5" />
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="aspect-4/3 animate-pulse rounded-2xl bg-white/5" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-11 animate-pulse rounded-md bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}
