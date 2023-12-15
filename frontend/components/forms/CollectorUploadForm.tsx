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

const validationSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .refine(
      (value) =>
        /^[a-zA-Z0-9- ]*$/.test(value) &&
        value.length <= 60 &&
        value.length >= 2,
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
  lat: z
    .string()
    .refine((value) => /^[0-9,.]*$/.test(value), {
      message: "Latitude must contain only numbers, commas, or points",
    })
    .transform((value) => parseFloat(value))
    .refine((val) => !isNaN(val) && val >= -90 && val <= 90, {
      message: "Latitude must be a valid number between -90 and 90",
    }),
  lng: z
    .string()
    .refine((value) => /^[0-9,.]*$/.test(value), {
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
  collection_types: z.array(z.string()).nonempty(),
  authorized_vehicle_types: z.array(z.string()).nonempty(),
  material_recovery_types: z.array(z.string()).nonempty(),
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
      await createCollector({ ...values });
    } catch (err) {
      console.log(err);
    }
  };

  const renderInput = (
    label: keyof CollectorCreate,
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
    label: keyof CollectorCreate,
    placeholder: string,
    options: FilterOption[]
  ) => {
    const error = errors[label]?.message;

    return (
      <div className={`w-full`}>
        <Controller
          control={control}
          render={({ field }) => (
            <>
              <Select
                options={options}
                selectedOptions={options.filter((option) => {
                  return (
                    field.value &&
                    (field.value as string[]).includes(option.name)
                  );
                })}
                placeholder={placeholder}
                onChange={(selectedOptions) => {
                  setValue(
                    label,
                    selectedOptions.map((option) => option.name)
                  );
                  trigger(label);
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
            {renderInput("name", "Name")}
            {renderInput("address", "Address")}
            {renderInput("zip_code", "Zip Code")}
            {renderInput("city", "City")}
            {renderInput("lat", "Latitude")}
            {renderInput("lng", "Longitude")}
            <br />
            {renderInput("email", "Email")}
            {renderInput("phone", "Phone")}
            <br />
            {renderSelect(
              "collection_types",
              "Select Collections...",
              filterOptions?.collection_types || []
            )}
            {renderSelect(
              "authorized_vehicle_types",
              "Select Authorized Vehicles...",
              filterOptions?.authorized_vehicle_types || []
            )}
            {renderSelect(
              "material_recovery_types",
              "Select Material Recoveries...",
              filterOptions?.material_recovery_types || []
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
