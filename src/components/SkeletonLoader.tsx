import React from 'react';

interface SkeletonLoaderProps {
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-card border border-border rounded-xl overflow-hidden flex flex-col h-[420px] animate-pulse"
        >
          {/* Image skeleton */}
          <div className="w-full h-48 bg-muted/20" />

          {/* Body skeleton */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              {/* Category tag */}
              <div className="h-4 bg-muted/20 rounded w-1/4 mb-3" />
              
              {/* Title */}
              <div className="h-6 bg-muted/20 rounded w-3/4 mb-2" />
              <div className="h-6 bg-muted/20 rounded w-1/2 mb-4" />

              {/* Address */}
              <div className="h-4 bg-muted/20 rounded w-5/6 mb-4" />

              {/* Specs (beds, baths) */}
              <div className="flex gap-4 mb-4">
                <div className="h-4 bg-muted/20 rounded w-12" />
                <div className="h-4 bg-muted/20 rounded w-12" />
              </div>
            </div>

            <div>
              <hr className="border-border mb-4" />
              {/* Footer (Price & Button) */}
              <div className="flex justify-between items-center">
                <div className="h-6 bg-muted/20 rounded w-20" />
                <div className="h-10 bg-muted/20 rounded-lg w-24" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
