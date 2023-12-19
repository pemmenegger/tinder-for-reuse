import React, { HTMLInputTypeAttribute } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Select } from "../ui/select";
import { FilterOption } from "../search/SearchInputContainer";
import {
  createContractor,
  fetchContractorFilterOptions,
} from "@/lib/api/contractors";
import { ContractorCreate } from "@/types/api/contractor";
import { renderInput, renderSelect } from "./renderFields";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import useSWR from "swr";

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
    .refine(
      (value) => {
        if (value) {
          return (
            /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value) &&
            value.length <= 50
          );
        }
        return true;
      },
      {
        message: "Invalid email address",
      }
    )
    .optional(),
  phone: z
    .string()
    .refine(
      (value) => {
        if (value) {
          return (
            /^[+0-9-]*$/.test(value) && value.length <= 60 && value.length >= 2
          );
        }
        return true;
      },
      {
        message: "Invalid phone",
      }
    )
    .optional(),
  material_types: z.array(z.string()).nonempty(),
  waste_code_types: z.array(z.string()).nonempty(),
  circular_service_types: z.array(z.string()).nonempty(),
});

export default function ContractorUploadForm() {
  const router = useRouter();
  const { data: filterOptions, error: filterOptionsError } = useSWR(
    "/api/contractors/filter/",
    fetchContractorFilterOptions
  );
  const { control, register, handleSubmit, setValue, formState, trigger } =
    useForm<ContractorCreate>({
      resolver: zodResolver(validationSchema),
      mode: "onBlur",
      reValidateMode: "onBlur",
    });
  const { errors, isValid } = formState;

  const onSubmit = async (values: ContractorCreate) => {
    try {
      console.log(`sent to backend: ${JSON.stringify(values)}`);
      await createContractor({ ...values });
      toast.success("Successfully uploaded contractor");
      router.push("/building-elements/contractors");
    } catch (err) {
      console.log(err);
    }
  };

  const renderInputInternal = (
    label: keyof ContractorCreate,
    placeholder: string
  ) => {
    return renderInput<ContractorCreate>({
      register,
      errors,
      label,
      placeholder,
    });
  };

  const renderSelectInternal = (
    label: keyof ContractorCreate,
    placeholder: string,
    options: FilterOption[]
  ) => {
    return renderSelect<ContractorCreate>({
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
      <h2>Upload Contractor</h2>
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
              "circular_service_types",
              "Select Circular Services...",
              filterOptions?.circular_service_types || []
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
