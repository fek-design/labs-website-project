import React from "react";

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-[#262626] mb-8">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-[#202021] rounded" />
          <div className="h-8 w-64 bg-[#262626] rounded-lg" />
          <div className="h-4 w-48 bg-[#151517] rounded" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-16 w-28 bg-[#151517] border border-[#262626] rounded-xl" />
          <div className="h-16 w-28 bg-[#151517] border border-[#262626] rounded-xl" />
          <div className="h-16 w-28 bg-[#151517] border border-[#262626] rounded-xl" />
          <div className="h-16 w-28 bg-[#151517] border border-[#262626] rounded-xl" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        <div className="h-10 w-32 bg-[#151517] rounded-full border border-[#262626]" />
        <div className="h-10 w-36 bg-[#151517] rounded-full border border-[#262626]" />
        <div className="h-10 w-28 bg-[#151517] rounded-full border border-[#262626]" />
        <div className="h-10 w-32 bg-[#151517] rounded-full border border-[#262626]" />
      </div>

      {/* Main Workspace Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (Search & Inventory Skeletons) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="h-12 w-full bg-[#151517] rounded-xl border border-[#262626]" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-56 bg-[#151517] border border-[#262626] rounded-2xl p-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="h-32 bg-[#202021] rounded-xl" />
                  <div className="h-4 w-3/4 bg-[#262626] rounded" />
                </div>
                <div className="h-4 w-1/2 bg-[#202021] rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (Cart / Session Panel Skeleton) */}
        <div className="lg:col-span-4">
          <div className="h-96 bg-[#151517] border border-[#262626] rounded-2xl p-6 space-y-4">
            <div className="h-6 w-1/2 bg-[#262626] rounded" />
            <div className="h-32 bg-[#202021] rounded-xl" />
            <div className="h-10 w-full bg-[#262626] rounded-full mt-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
