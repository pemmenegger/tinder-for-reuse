import { ResultCardProps } from "@/types/map";
import React from "react";
import { CardReadableCollapsible } from "./Card";
import { BuildingElementUploadCreate } from "@/types/api/building-element";
import { BuildingElementCard } from "./BuildingElementCard";

export function BuildingElementUploadCard({
  isActive = false,
  data,
  ...props
}: ResultCardProps) {
  const buildingElementUpload = data as BuildingElementUploadCreate;

  return (
    <CardReadableCollapsible
      isActive={isActive}
      activeClassName="border-[#5442f5]"
      attributes={[
        { label: "Address", value: buildingElementUpload.address },
        {
          label: "Total Items",
          value: buildingElementUpload.building_elements.length,
        },
      ]}
      {...props}
    >
      <div className="flex flex-col gap-4">
        {buildingElementUpload.building_elements.map(
          (buildingElement, index) => (
            <BuildingElementCard data={buildingElement} key={index} />
          )
        )}
      </div>
    </CardReadableCollapsible>
  );
}
