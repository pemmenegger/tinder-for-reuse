import React, { HTMLInputTypeAttribute } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Select } from "../ui/select";
import { FilterOption } from "../search/SearchInputContainer";
import {
  createCollector,
  fetchCollectorFilterOptions,
} from "@/lib/api/collectors";
import { useFilterOptions } from "../hooks/useFilterOptions";
import { CollectorCreate } from "@/types/api/collector";
import { renderInput, renderSelect } from "./renderFields";

const validationSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .refine((value) => value.length <= 60 && value.length >= 2, {
      message: "Invalid name",
    }),
  address: z
    .string()
    .min(1, { message: "Address is required" })
    .refine((value) => value.length <= 60 && value.length >= 2, {
      message: "Invalid address",
    }),
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
    .refine((value) => value.length <= 60 && value.length >= 2, {
      message: "Invalid city",
    }),
  lat: z
    .string()
    .refine((value) => /^[-0-9,.]*$/.test(value), {
      message: "Latitude must contain only numbers, commas, or points",
    })
    .transform((value) => parseFloat(value))
    .refine((val) => !isNaN(val) && val >= -90 && val <= 90, {
      message: "Latitude must be a valid number between -90 and 90",
    }),
  lng: z
    .string()
    .refine((value) => /^[-0-9,.]*$/.test(value), {
      message: "Longitude must contain only numbers, commas, or points",
    })
    .transform((value) => parseFloat(value))
    .refine((val) => !isNaN(val) && val >= -180 && val <= 180, {
      message: "Longitude must be a valid number between -180 and 180",
    }),
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
        /^[+0-9-]*$/.test(value) && value.length <= 60 && value.length >= 2,
      {
        message: "Invalid phone",
      }
    ),
  material_types: z.array(z.string()).nonempty(),
  waste_code_types: z.array(z.string()).nonempty(),
  authorized_vehicle_types: z.array(z.string()).nonempty(),
  circular_strategy_types: z.array(z.string()).nonempty(),
});

export default function CollectorUploadForm() {
  const { filterOptions, error: filterOptionsError } = useFilterOptions(
    fetchCollectorFilterOptions
  );
  const { control, register, handleSubmit, setValue, formState, trigger } =
    useForm<CollectorCreate>({
      resolver: zodResolver(validationSchema),
      mode: "onBlur",
      reValidateMode: "onBlur",
    });
  const { errors, isValid } = formState;

  const onSubmit = async (values: CollectorCreate) => {
    try {
      console.log(`sent to backend: ${JSON.stringify(values)}`);
      // await createCollector({ ...values });
    } catch (err) {
      console.log(err);
    }
  };

  const renderInputInternal = (
    label: keyof CollectorCreate,
    placeholder: string
  ) => {
    return renderInput<CollectorCreate>({
      register,
      errors,
      label,
      placeholder,
    });
  };

  const renderSelectInternal = (
    label: keyof CollectorCreate,
    placeholder: string,
    options: FilterOption[]
  ) => {
    return renderSelect<CollectorCreate>({
      control,
      setValue,
      trigger,
      errors,
      label,
      placeholder,
      options,
    });
  };

  if (filterOptionsError) {
    return <p>Failed to load page.</p>;
  }

  return (
    <div>
      <h2>Upload Collector</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-1/2 max-w-[1080px] flex-col gap-2"
      >
        <div className="flex flex-col max-w-[1080px] gap-9">
          <div className="flex flex-col gap-2">
            {renderInputInternal("name", "Name")}
            {renderInputInternal("address", "Address")}
            {renderInputInternal("zip_code", "Zip Code")}
            {renderInputInternal("city", "City")}
            {renderInputInternal("lat", "Latitude")}
            {renderInputInternal("lng", "Longitude")}
            <br />
            {renderInputInternal("email", "Email")}
            {renderInputInternal("phone", "Phone")}
            <br />
            {renderSelectInternal(
              "material_types",
              "Select Materials...",
              filterOptions?.material_types || []
            )}
            {renderSelectInternal(
              "waste_code_types",
              "Select Waste Codes...",
              filterOptions?.waste_code_types || []
            )}
            {renderSelectInternal(
              "authorized_vehicle_types",
              "Select Authorized Vehicles...",
              filterOptions?.authorized_vehicle_types || []
            )}
            {renderSelectInternal(
              "circular_strategy_types",
              "Select Circular Strategies...",
              filterOptions?.circular_strategy_types || []
            )}
          </div>

          <div className="flex flex-col gap-2">
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
