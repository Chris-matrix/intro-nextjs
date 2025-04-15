'use client';

export default function SkeletonLoader() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
      {[...Array(3)].map((_, index) => (
        <div key={index} className="border p-4 rounded shadow-sm mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div className="flex justify-between">
            <div className="h-5 bg-gray-200 rounded w-12"></div>
            <div className="h-5 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
