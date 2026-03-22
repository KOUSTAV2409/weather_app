const LoadingSkeleton = () => (
  <div className="vercel-card fade-in rounded-2xl p-8">
    <div className="mb-12 flex items-start justify-between">
      <div className="flex flex-col gap-2">
        <div className="h-6 w-48 rounded shimmer" />
        <div className="h-4 w-32 rounded shimmer" />
      </div>
      <div className="size-8 rounded-lg shimmer" />
    </div>

    <div className="mb-12 flex items-end">
      <div className="h-24 w-40 rounded shimmer" />
      <div className="ml-8 size-16 shrink-0 rounded-full shimmer" />
    </div>

    <div className="mb-8 flex flex-col gap-2">
      <div className="h-5 w-32 rounded shimmer" />
      <div className="h-4 w-full rounded shimmer" />
    </div>

    <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="h-3 w-16 rounded shimmer" />
          <div className="h-5 w-12 rounded shimmer" />
        </div>
      ))}
    </div>

    <div className="grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="h-3 w-16 rounded shimmer" />
          <div className="h-4 w-12 rounded shimmer" />
        </div>
      ))}
    </div>
  </div>
);

export default LoadingSkeleton;
