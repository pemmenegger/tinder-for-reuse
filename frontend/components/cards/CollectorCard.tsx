import React from "react";
import { CollectorEditForm } from "../forms/CollectorForm";
import { ResultCardProps } from "@/types/item";
import { CardEditable } from "./Card";

export function CollectorCard({
  isActive = false,
  data,
  ...props
}: ResultCardProps) {
  console.log(props);
  return (
    <CardEditable
      isActive={isActive}
      activeClassName="border-[#C95139]"
      attributes={[
        { label: "Name", value: data.name },
        {
          label: "Address",
          value: `${data.address}, ${data.zip_code}, ${data.city}`,
        },
        { label: "Email", value: data.email },
        { label: "Phone", value: data.phone },
        { label: "Materials", value: data.material_types },
        { label: "Waste Codes", value: data.waste_code_types },
        {
          label: "Authorized Vehicles",
          value: data.authorized_vehicle_types,
        },
        {
          label: "Circular Strategies",
          value: data.circular_strategy_types,
        },
      ]}
      name="Collector"
      data={data}
      EditForm={CollectorEditForm}
      {...props}
    />
  );
}
