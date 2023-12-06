import { CollectorRead } from "@/types/api/collector";
import React from "react";

export function CollectorCard({
  name,
  address,
  zip_code,
  city,
  email,
  phone,
  collection_types,
  isActive,
}: CollectorRead & { isActive: boolean }) {
  const renderProperty = (label: string, value: any) => {
    if (value !== null && value !== undefined) {
      return (
        <>
          <p>{label}</p>
          <p>{Array.isArray(value) ? value.join(", ") : value}</p>
        </>
      );
    }
    return null;
  };

  return (
    <div
      className={`grid grid-cols-2 mt-8 bg-white border shadow-sm rounded-xl p-5 ${
        isActive ? "border-[#C95139]" : "border-dgray/40"
      }`}
    >
      {renderProperty("Name", name)}
      {renderProperty("Address", `${address}, ${zip_code}, ${city}`)}
      {renderProperty("Email", email)}
      {renderProperty("Phone", phone)}
      {renderProperty("Collection Types", collection_types)}
    </div>
  );
}

export function CollectorCardSkeleton() {
  const skeletonLines = new Array(10).fill(null);

  const renderSkeletonLine = () => {
    return (
      <>
        <div className="h-[1rem] w-2/5 bg-gray-200 rounded"></div>
        {/* Label placeholder */}
        <div className="h-[1rem] w-3/5 bg-gray-300 rounded"></div>
        {/* Value placeholder */}
      </>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-4 mt-8 bg-white shadow-sm border border-gray-200 rounded-xl p-5 animate-pulse">
      {skeletonLines.map((_, index) => (
        <React.Fragment key={index}>{renderSkeletonLine()}</React.Fragment>
      ))}
    </div>
  );
}
