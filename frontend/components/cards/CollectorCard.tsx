import { CollectorRead } from "@/types/api/collector";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { CollectorEditForm } from "../forms/CollectorForm";
import toast from "react-hot-toast";
import { PencilIcon as PencilIconOutline } from "@heroicons/react/24/outline";

export function CollectorCard({
  id,
  name,
  address,
  zip_code,
  city,
  lat,
  lng,
  email,
  phone,
  material_types,
  waste_code_types,
  authorized_vehicle_types,
  circular_strategy_types,
  isActive,
}: CollectorRead & { isActive: boolean }) {
  const [isEditing, setIsEditing] = useState(false);

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
      className={`relative mt-10 bg-white border shadow-sm rounded-xl p-5 ${
        isActive ? "border-[#C95139]" : "border-dgray/40"
      }`}
    >
      {isEditing ? (
        <CollectorEditForm
          onCancel={() => setIsEditing(false)}
          onSuccess={() => {
            toast.success("Collector updated successfully");
            setIsEditing(false);
          }}
          defaultValues={{
            name,
            address,
            zip_code,
            city,
            lat,
            lng,
            email,
            phone,
            material_types,
            waste_code_types,
            authorized_vehicle_types,
            circular_strategy_types,
          }}
          collectorId={id}
        />
      ) : (
        <>
          <div className={`grid grid-cols-2`}>
            {renderProperty("Name", name)}
            {renderProperty("Address", `${address}, ${zip_code}, ${city}`)}
            {renderProperty("Email", email)}
            {renderProperty("Phone", phone)}
            {renderProperty("Materials", material_types)}
            {renderProperty("Waste Codes", waste_code_types)}
            {renderProperty("Authorized Vehicles", authorized_vehicle_types)}
            {renderProperty("Circular Strategies", circular_strategy_types)}
          </div>
          <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3">
            <Button variant="secondary" onClick={() => setIsEditing(true)}>
              <PencilIconOutline className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
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
