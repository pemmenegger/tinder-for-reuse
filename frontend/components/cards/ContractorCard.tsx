import { ResultCardProps } from "@/types/item";
import React from "react";
import { CardEditable } from "./Card";
import { ContractorEditForm } from "../forms/ContractorForm";
import { ContractorCreate } from "@/types/api/contractor";

export function ContractorCard({
  isActive = false,
  data,
  ...props
}: ResultCardProps) {
  const contractor = data as ContractorCreate;
  return (
    <CardEditable
      isActive={isActive}
      activeClassName="border-[#5442f5]"
      attributes={[
        { label: "Name", value: contractor.name },
        {
          label: "Address",
          value: `${contractor.address}, ${contractor.zip_code}, ${contractor.city}`,
        },
        { label: "Email", value: contractor.email },
        { label: "Phone", value: contractor.phone },
        { label: "Materials", value: contractor.material_types },
        { label: "Waste Codes", value: contractor.waste_code_types },
        {
          label: "Circular Services",
          value: contractor.circular_service_types,
        },
      ]}
      name="Contractor"
      data={data}
      EditForm={ContractorEditForm}
      {...props}
    />
  );
}
