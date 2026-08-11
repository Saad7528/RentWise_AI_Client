import React from 'react';

interface SkeletonLoaderProps {
  count?: number;
}

// 1. Grid of Property Cards Skeleton (Used in Home & Rentals Explore)
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col h-[420px] shadow-sm animate-pulse"
        >
          {/* Image skeleton */}
          <div className="w-full h-48 bg-muted/20 relative">
            <div className="absolute top-3 left-3 w-20 h-5 rounded-full bg-muted/30" />
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-muted/30" />
          </div>

          {/* Body skeleton */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              {/* Category tag */}
              <div className="h-3.5 bg-muted/20 rounded-full w-1/4 mb-3" />
              
              {/* Title lines */}
              <div className="h-5 bg-muted/20 rounded-md w-4/5 mb-2" />
              <div className="h-4 bg-muted/15 rounded-md w-3/5 mb-4" />

              {/* Address */}
              <div className="flex items-center gap-2 mb-4">
                <div className="h-4 w-4 rounded-full bg-muted/20 shrink-0" />
                <div className="h-3.5 bg-muted/15 rounded w-3/4" />
              </div>

              {/* Specs (beds, baths) */}
              <div className="flex gap-4 mb-4">
                <div className="h-4 bg-muted/20 rounded-md w-16" />
                <div className="h-4 bg-muted/20 rounded-md w-16" />
              </div>
            </div>

            <div>
              <hr className="border-border/60 mb-4" />
              {/* Footer (Price & Button) */}
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="h-2.5 bg-muted/15 rounded w-12" />
                  <div className="h-6 bg-muted/20 rounded-md w-24" />
                </div>
                <div className="h-9 bg-muted/20 rounded-xl w-24" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// 2. Property Detail Page Full Skeleton
export const PropertyDetailSkeleton: React.FC = () => {
  return (
    <div className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full animate-pulse">
      {/* Back button skeleton */}
      <div className="h-4 bg-muted/20 rounded w-24 mb-6" />

      {/* Main Grid: Gallery & Host Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left 2 Cols: Big Image & Thumbnails */}
        <div className="lg:col-span-2 space-y-4">
          <div className="w-full h-80 sm:h-[420px] rounded-3xl bg-muted/20" />
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-24 h-20 rounded-xl bg-muted/20 shrink-0" />
            ))}
          </div>
        </div>

        {/* Right 1 Col: Host & Pricing Card */}
        <div className="bg-card border border-border rounded-3xl p-6 h-fit space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-8 bg-muted/20 rounded-lg w-32" />
            <div className="h-6 bg-muted/20 rounded-full w-20" />
          </div>

          <hr className="border-border" />

          {/* Landlord Info */}
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-muted/20 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted/20 rounded w-28" />
              <div className="h-3 bg-muted/15 rounded w-20" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="h-11 bg-muted/20 rounded-xl w-full" />
            <div className="h-11 bg-muted/20 rounded-xl w-full" />
          </div>
        </div>
      </div>

      {/* Details & Specs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Title & Badges */}
          <div className="space-y-3">
            <div className="h-8 bg-muted/20 rounded-xl w-3/4" />
            <div className="h-4 bg-muted/15 rounded w-1/2" />
          </div>

          {/* Key Specs Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card border border-border p-4 rounded-2xl space-y-2">
                <div className="h-4 w-4 bg-muted/20 rounded" />
                <div className="h-3 bg-muted/15 rounded w-12" />
                <div className="h-5 bg-muted/20 rounded w-16" />
              </div>
            ))}
          </div>

          {/* Description Box */}
          <div className="bg-card border border-border p-6 rounded-3xl space-y-4">
            <div className="h-6 bg-muted/20 rounded w-36" />
            <div className="space-y-2">
              <div className="h-4 bg-muted/15 rounded w-full" />
              <div className="h-4 bg-muted/15 rounded w-full" />
              <div className="h-4 bg-muted/15 rounded w-4/5" />
            </div>
          </div>

          {/* Map Section */}
          <div className="bg-card border border-border p-6 rounded-3xl space-y-4">
            <div className="h-6 bg-muted/20 rounded w-32" />
            <div className="w-full h-72 bg-muted/20 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Table Skeleton (for Manage Listings & Admin Properties/Users)
export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm animate-pulse w-full">
      <div className="p-4 border-b border-border bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
        <div className="h-4 bg-muted/20 rounded w-32" />
        <div className="h-8 bg-muted/20 rounded-lg w-24" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="h-12 w-12 rounded-xl bg-muted/20 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 bg-muted/20 rounded w-3/5" />
                <div className="h-3 bg-muted/15 rounded w-2/5" />
              </div>
            </div>
            <div className="h-6 bg-muted/20 rounded-md w-20 hidden sm:block" />
            <div className="h-6 bg-muted/20 rounded-full w-24" />
            <div className="h-8 bg-muted/20 rounded-lg w-20" />
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. Form Page Skeleton (for Add Listing Page & Profile Page)
export const FormPageSkeleton: React.FC = () => {
  return (
    <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 animate-pulse space-y-8">
      <div className="space-y-2">
        <div className="h-4 bg-muted/20 rounded w-24" />
        <div className="h-8 bg-muted/20 rounded-xl w-64" />
        <div className="h-4 bg-muted/15 rounded w-80" />
      </div>

      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="h-4 bg-muted/20 rounded w-28" />
            <div className="h-11 bg-muted/15 rounded-xl w-full" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted/20 rounded w-28" />
            <div className="h-11 bg-muted/15 rounded-xl w-full" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-muted/20 rounded w-36" />
          <div className="h-28 bg-muted/15 rounded-xl w-full" />
        </div>

        <div className="h-12 bg-muted/20 rounded-xl w-44 ml-auto" />
      </div>
    </div>
  );
};

// 5. User Profile Skeleton
export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-12 animate-pulse space-y-8">
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Avatar & Header */}
        <div className="flex items-center gap-5 pb-6 border-b border-border">
          <div className="w-20 h-20 rounded-full bg-muted/20 shrink-0" />
          <div className="space-y-2">
            <div className="h-6 bg-muted/20 rounded-md w-40" />
            <div className="h-4 bg-muted/15 rounded-md w-56" />
            <div className="h-4 bg-muted/20 rounded-full w-20" />
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-muted/20 rounded w-20" />
            <div className="h-11 bg-muted/15 rounded-xl w-full" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted/20 rounded w-20" />
            <div className="h-11 bg-muted/15 rounded-xl w-full" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted/20 rounded w-20" />
            <div className="h-11 bg-muted/15 rounded-xl w-full" />
          </div>
        </div>

        <div className="h-12 bg-muted/20 rounded-xl w-36" />
      </div>
    </div>
  );
};

// 6. Admin Dashboard Skeleton
export const AdminDashboardSkeleton: React.FC = () => {
  return (
    <div className="flex-1 py-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 space-y-10 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center pb-6 border-b border-border">
        <div className="space-y-2">
          <div className="h-4 bg-muted/20 rounded w-28" />
          <div className="h-8 bg-muted/20 rounded-xl w-64" />
        </div>
        <div className="h-12 bg-muted/20 rounded-xl w-48" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card border border-border p-6 rounded-2xl space-y-3">
            <div className="h-5 w-5 bg-muted/20 rounded" />
            <div className="h-8 bg-muted/20 rounded-md w-20" />
            <div className="h-3 bg-muted/15 rounded w-24" />
          </div>
        ))}
      </div>

      {/* Tables & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <TableSkeleton rows={4} />
        </div>
        <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
          <div className="h-5 bg-muted/20 rounded w-32" />
          <div className="h-48 bg-muted/15 rounded-full w-48 mx-auto" />
        </div>
      </div>
    </div>
  );
};
