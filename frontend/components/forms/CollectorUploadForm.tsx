import React, { HTMLInputTypeAttribute, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Select } from "../ui/select";
import { FilterOption } from "../search/SearchInputContainer";

export type CollectorUploadInputs = {
  name: string;
  address: string;
  zip_code: string;
  city: string;
  lat: number;
  lng: number;
  email?: string;
  phone: string;
  collection_types: string[];
  authorized_vehicle_types: string[];
  material_recovery_types: string[];
  // TODO: opening hours and holidays
};

const validationSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .refine(
      (value) =>
        /^[a-zA-Z-]*$/.test(value) && value.length <= 60 && value.length >= 2,
      {
        message: "Invalid name",
      }
    ),
  address: z
    .string()
    .min(1, { message: "Address is required" })
    .refine(
      (value) =>
        /^[a-zA-Z0-9- ]*$/.test(value) &&
        value.length <= 60 &&
        value.length >= 2,
      {
        message: "Invalid address",
      }
    ),
  zip_code: z
    .string()
    .min(1, { message: "Zip code is required" })
    .refine(
      (value) =>
        /^[a-zA-Z0-9- ]*$/.test(value) &&
        value.length <= 60 &&
        value.length >= 2,
      {
        message: "Invalid zip code",
      }
    ),
  city: z
    .string()
    .min(1, { message: "City is required" })
    .refine(
      (value) =>
        /^[a-zA-Z- ]*$/.test(value) && value.length <= 60 && value.length >= 2,
      {
        message: "Invalid city",
      }
    ),
  lat: z.number(),
  lng: z.number(),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .refine(
      (value) =>
        /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value) &&
        value.length <= 50,
      {
        message: "Invalid email address",
      }
    ),
  phone: z
    .string()
    .min(1, { message: "Phone is required" })
    .refine(
      (value) =>
        /^[0-9-]*$/.test(value) && value.length <= 60 && value.length >= 2,
      {
        message: "Invalid phone",
      }
    ),
  collection_types: z.array(z.string()).nonempty(),
  authorized_vehicle_types: z.array(z.string()).nonempty(),
  material_recovery_types: z.array(z.string()).nonempty(),
});

export default function CollectorUploadForm() {
  const { control, register, handleSubmit, setValue, formState } =
    useForm<CollectorUploadInputs>({
      resolver: zodResolver(validationSchema),
      mode: "onBlur",
      reValidateMode: "onBlur",
    });
  const { errors, isValid } = formState;

  const onSubmit = async (values: CollectorUploadInputs) => {
    try {
      console.log(`sent to backend: ${JSON.stringify(values)}`);
      // TODO send to backend
    } catch (err) {
      console.log(err);
    }
  };

  const renderInput = (
    label: keyof CollectorUploadInputs,
    placeholder: string,
    type?: HTMLInputTypeAttribute
  ) => {
    const error = errors[label]?.message;
    return (
      <div className={`w-full`}>
        <Input {...register(label)} placeholder={placeholder} type={type} />
        {error && <p className="px-2.5 pt-1.5 text-sm text-red">{error}</p>}
      </div>
    );
  };

  const renderSelect = (
    label: keyof CollectorUploadInputs,
    placeholder: string,
    options: FilterOption[]
  ) => {
    const error = errors[label]?.message;
    const [selectedOptions, setSelectedOptions] = useState<FilterOption[]>([]);
    return (
      <div className={`w-full`}>
        <Controller
          control={control}
          render={({ field }) => (
            <>
              <Select
                options={options}
                selectedOptions={selectedOptions}
                placeholder={placeholder}
                onChange={(selectedOptions) => {
                  setSelectedOptions(selectedOptions);
                  setValue(
                    "collection_types",
                    selectedOptions.map((option) => option.name)
                  );
                }}
                isMultiSelect={true}
              />
              {error && (
                <p className="px-2.5 pt-1.5 text-sm text-red">{error}</p>
              )}
            </>
          )}
          name={label}
        />
      </div>
    );
  };

  return (
    <div>
      <h2>Upload Collector</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-1/2 max-w-[1080px] flex-col gap-2"
      >
        <div className="flex flex-col max-w-[1080px] gap-9">
          <div className="flex flex-col gap-2">
            {renderInput("name", "Name")}
            {renderInput("address", "Address")}
            {renderInput("zip_code", "Zip Code")}
            {renderInput("city", "City")}
            {renderInput("lat", "Latitude", "number")}
            {renderInput("lng", "Longitude", "number")}
            <br />
            {renderInput("email", "Email")}
            {renderInput("phone", "Phone")}
            <br />
            {renderSelect("collection_types", "Select Collections...", [
              { id: "1", name: "Paper" },
              { id: "2", name: "Plastic" },
              { id: "3", name: "Glass" },
            ])}
            {renderSelect(
              "authorized_vehicle_types",
              "Select Authorized Vehicles...",
              [
                { id: "1", name: "Small Van (3 to 5 m³)" },
                { id: "2", name: "Medium Van (6 to 12 m³)" },
                { id: "3", name: "Flatbed Truck (Over 12 m³)" },
              ]
            )}
            {renderSelect(
              "material_recovery_types",
              "Select Material Recoveries...",
              [
                { id: "1", name: "Reuse" },
                { id: "2", name: "Recycling" },
                { id: "3", name: "Reparation" },
              ]
            )}
          </div>

          <div className="flex flex-col gap-2">
            <button type="submit">Submit</button>
            <Button
              variant={isValid ? "primary" : "disabled"}
              size="sm"
              disabled={!isValid}
            >
              Upload
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
