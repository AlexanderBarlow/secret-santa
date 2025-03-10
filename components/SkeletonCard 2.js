import React from "react";

export default function SkeletonCard() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-300 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6 mb-3"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3 mb-3"></div>
      <div className="h-4 bg-gray-300 rounded w-full mb-3"></div>
      <div className="h-10 bg-gray-300 rounded w-1/2 mt-4"></div>
    </div>
  );
}
