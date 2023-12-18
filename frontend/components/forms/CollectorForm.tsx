import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { FilterOption } from "../search/SearchInputContainer";
import {
  createCollector,
  fetchCollectorFilterOptions,
  updateCollector,
} from "@/lib/api/collectors";
import { CollectorCreate } from "@/types/api/collector";
import { renderInput, renderSelect } from "./renderFields";
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
  authorized_vehicle_types: z.array(z.string()).nonempty(),
  circular_strategy_types: z.array(z.string()).nonempty(),
});

export default function CollectorBaseForm({
  onCancel,
  onSubmit,
  defaultValues,
  submitLabel = "Upload",
}: {
  onCancel?: () => void;
  onSubmit: (values: CollectorCreate) => Promise<void>;
  defaultValues?: CollectorCreate;
  submitLabel?: string;
}) {
  const { data: filterOptions, error: filterOptionsError } = useSWR(
    "/api/collectors/filter/",
    fetchCollectorFilterOptions
  );
  const { control, register, handleSubmit, setValue, formState, trigger } =
    useForm<CollectorCreate>({
      resolver: zodResolver(validationSchema),
      mode: "onBlur",
      reValidateMode: "onBlur",
      defaultValues,
    });
  const { errors, isValid } = formState;

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

  // w-1/2 max-w-[1080px]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <div className="flex flex-col gap-9">
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
          {onCancel && (
            <Button variant="secondary" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            variant={isValid ? "primary" : "disabled"}
            size="sm"
            disabled={!isValid}
          >
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}

export function CollectorCreateForm({
  onSuccess,
}: {
  onSuccess?: () => void | Promise<void>;
}) {
  const onSubmit = async (values: CollectorCreate) => {
    try {
      console.log(`createCollector to backend: ${JSON.stringify(values)}`);
      await createCollector(values);
      await onSuccess?.();
    } catch (err) {
      console.error(err);
    }
  };

  return <CollectorBaseForm onSubmit={onSubmit} />;
}

export function CollectorEditForm({
  onCancel,
  onSuccess,
  defaultValues,
  collectorId,
}: {
  onCancel?: () => void;
  onSuccess?: () => void | Promise<void>;
  defaultValues?: CollectorCreate;
  collectorId: number;
}) {
  const onSubmit = async (values: CollectorCreate) => {
    try {
      console.log(`editCollector to backend: ${JSON.stringify(values)}`);
      await updateCollector(collectorId, values);
      await onSuccess?.();
    } catch (err) {
      console.error(err);
    }
  };

  console.log(`defaultValues: ${JSON.stringify(defaultValues)}`);
  console.log(`collectorId: ${collectorId}`);

  return (
    <CollectorBaseForm
      onSubmit={onSubmit}
      onCancel={onCancel}
      defaultValues={defaultValues}
      submitLabel="Update"
    />
  );
}
