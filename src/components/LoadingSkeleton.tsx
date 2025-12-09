const LoadingSkeleton = () => (
  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 max-w-4xl w-full animate-pulse">
    <div className="flex flex-col items-center mb-8">
      <div className="w-32 h-32 bg-gray-300 dark:bg-gray-600 rounded-full mb-4" />
      <div className="w-48 h-12 bg-gray-300 dark:bg-gray-600 rounded" />
    </div>
    <div className="grid grid-cols-2 gap-4 mb-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-20 bg-gray-300 dark:bg-gray-600 rounded-xl" />
      ))}
    </div>
  </div>
);

export default LoadingSkeleton;
