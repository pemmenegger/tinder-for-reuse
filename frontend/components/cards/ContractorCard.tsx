import { ResultCardProps } from "@/types/item";
import React from "react";
import { CardEditable } from "./Card";
import { CollectorEditForm } from "../forms/CollectorForm";

export function ContractorCard({
  isActive = false,
  data,
  ...props
}: ResultCardProps) {
  return (
    <CardEditable
      isActive={isActive}
      activeClassName="border-[#5442f5]"
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
      ]}
      name="Contractor"
      data={data}
      EditForm={CollectorEditForm}
      {...props}
    />
  );
}
