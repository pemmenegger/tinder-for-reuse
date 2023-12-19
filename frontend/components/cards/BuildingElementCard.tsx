import { ResultCardProps } from "@/types/item";
import React from "react";
import { CardReadable } from "./Card";

export function BuildingElementCard({
  isActive = false,
  data,
  ...props
}: ResultCardProps) {
  return (
    <CardReadable
      isActive={isActive}
      activeClassName="border-[#5442f5]"
      attributes={[
        { label: "Title", value: data.item.title },
        {
          label: "Total Mass",
          value: `${data.total_mass} t`,
        },
        { label: "Total Volume", value: `${data.total_volume} m³` },
        { label: "Material", value: data.material },
        { label: "Condition", value: data.condition_sanitary },
        { label: "Reuse Potential", value: data.reuse_potential },
        { label: "Waste Code", value: data.waste_code },
        { label: "Recycling Potential", value: data.recycling_potential },
        { label: "Energy Recovery", value: data.energy_recovery },
        { label: "Disposal", value: data.disposal },
        { label: "Address", value: data.address },
        { label: "Worksheet", value: data.worksheet },
      ]}
      {...props}
    />
  );
}
