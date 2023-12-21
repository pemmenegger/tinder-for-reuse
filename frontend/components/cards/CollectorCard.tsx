import React from "react";
import { CollectorEditForm } from "../forms/CollectorForm";
import { ResultCardProps } from "@/types/item";
import { CardEditable } from "./Card";
import { CollectorCreate } from "@/types/api/collector";

export function CollectorCard({
  isActive = false,
  data,
  ...props
}: ResultCardProps) {
  const collector = data as CollectorCreate;
  return (
    <CardEditable
      isActive={isActive}
      activeClassName="border-[#C95139]"
      attributes={[
        { label: "Name", value: collector.name },
        {
          label: "Address",
          value: `${collector.address}, ${collector.zip_code}, ${collector.city}`,
        },
        { label: "Email", value: collector.email },
        { label: "Phone", value: collector.phone },
        { label: "Materials", value: collector.material_types },
        { label: "Waste Codes", value: collector.waste_code_types },
        {
          label: "Authorized Vehicles",
          value: collector.authorized_vehicle_types,
        },
        {
          label: "Circular Strategies",
          value: collector.circular_strategy_types,
        },
      ]}
      name="Collector"
      data={data}
      EditForm={CollectorEditForm}
      {...props}
    />
  );
}
