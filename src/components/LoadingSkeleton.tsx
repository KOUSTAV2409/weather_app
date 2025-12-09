const LoadingSkeleton = () => (
  <div className="vercel-card rounded-2xl p-8">
    <div className="flex justify-between items-start mb-12">
      <div className="space-y-2">
        <div className="w-48 h-6 shimmer rounded" />
        <div className="w-32 h-4 shimmer rounded" />
      </div>
      <div className="w-8 h-8 shimmer rounded-lg" />
    </div>
    
    <div className="flex items-end mb-12">
      <div className="w-40 h-24 shimmer rounded" />
      <div className="w-16 h-16 shimmer rounded-full ml-8" />
    </div>

    <div className="space-y-2 mb-8">
      <div className="w-32 h-5 shimmer rounded" />
      <div className="w-full h-4 shimmer rounded" />
    </div>

    <div className="grid grid-cols-4 gap-4 mb-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="w-16 h-3 shimmer rounded" />
          <div className="w-12 h-5 shimmer rounded" />
        </div>
      ))}
    </div>

    <div className="grid grid-cols-4 gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="w-16 h-3 shimmer rounded" />
          <div className="w-12 h-4 shimmer rounded" />
        </div>
      ))}
    </div>
  </div>
);

export default LoadingSkeleton;
