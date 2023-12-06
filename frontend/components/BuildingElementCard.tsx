import {
  BuildingElementCreate,
  BuildingElementRead,
} from "@/types/api/items/building-element";
import React from "react";

export function BuildingElementCard({
  quantity,
  total_mass_kg,
  total_volume_m3,
  localization,
  reuse_potential,
  drop_off_procedures,
  storage_method,
  category_type,
  unit_type,
  constitution_types,
  material_types,
  item,
  isActive = false,
}: (BuildingElementRead | BuildingElementCreate) & { isActive?: boolean }) {
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

  const formatQuantity = (quantity: number, unit: string) => {
    if (unit == "U") {
      return `${quantity} unit(s)`;
    }
    return `${quantity} ${unit}`;
  };

  return (
    <div
      className={`grid grid-cols-2 mt-8 bg-white border shadow-sm rounded-xl p-5 ${
        isActive ? "border-[#3A7118]" : "border-dgray/40"
      }`}
    >
      {renderProperty("Title", item.title)}
      {renderProperty("Category", category_type)}
      {renderProperty("Quantity", formatQuantity(quantity, unit_type))}
      {renderProperty("Total Mass", `${total_mass_kg} kg`)}
      {renderProperty("Total Volume", `${total_volume_m3} m³`)}
      {renderProperty("Localization", localization)}
      {renderProperty("Constitutions", constitution_types)}
      {renderProperty("Materials", material_types)}
      {renderProperty("Reuse Potential", reuse_potential)}
      {renderProperty("Drop Off Procedures", drop_off_procedures)}
      {renderProperty("Storage Method", storage_method)}
    </div>
  );
}

export function BuildingElementCardSkeleton() {
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
