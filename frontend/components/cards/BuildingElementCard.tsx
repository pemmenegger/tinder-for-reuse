import { ResultCardProps } from "@/types/item";
import React from "react";
import { CardReadable } from "./Card";
import { BuildingElementCreate } from "@/types/api/items/building-element";

export function BuildingElementCard({
  isActive = false,
  data,
  ...props
}: ResultCardProps) {
  const buildingElement = data as BuildingElementCreate;
  return (
    <CardReadable
      isActive={isActive}
      activeClassName="border-[#5442f5]"
      attributes={[
        { label: "Worksheet", value: buildingElement.worksheet_type },
        { label: "Category", value: buildingElement.category },
        { label: "Reference", value: buildingElement.reference },
        { label: "Title", value: buildingElement.title },
        { label: "Unit", value: buildingElement.unit_type },
        { label: "Total", value: buildingElement.total },
        {
          label: "Total Mass",
          value: `${buildingElement.total_mass_kg} kg`,
        },
        {
          label: "Total Volume",
          value: `${buildingElement.total_volume_m3} m3`,
        },
        { label: "Material", value: buildingElement.material_type },
        {
          label: "Health Status",
          value: buildingElement.health_status_type,
        },
        {
          label: "Reuse Potential",
          value: buildingElement.reuse_potential_type,
        },
        { label: "Waste Code", value: buildingElement.waste_code_type },
        {
          label: "Recycling Potential",
          value: buildingElement.recycling_potential_type,
        },
        {
          label: "Has Energy Recovery",
          value: buildingElement.has_energy_recovery,
        },
        {
          label: "Has Elimination",
          value: buildingElement.has_elimination,
        },
      ]}
      {...props}
    />
  );
}
