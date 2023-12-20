import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { FilterOption } from "../search/SearchInputContainer";
import {
  createContractor,
  deleteContractor,
  fetchContractorFilterOptions,
  updateContractor,
} from "@/lib/api/contractors";
import { ContractorCreate } from "@/types/api/contractor";
import { renderInput, renderSelect } from "./renderFields";
import useSWR from "swr";
import { EditFormProps } from "./forms";
import toast from "react-hot-toast";

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
  lat: z.coerce.number().refine((val) => val >= -90 && val <= 90, {
    message: "Latitude must be a valid number between -90 and 90",
  }),
  lng: z.coerce.number().refine((val) => val >= -180 && val <= 180, {
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

export default function ContractorBaseForm({
  onCancel,
  onDelete,
  onSubmit,
  defaultValues,
  submitLabel = "Upload",
}: {
  onCancel?: () => void;
  onDelete?: () => void;
  onSubmit: (values: ContractorCreate) => Promise<void>;
  defaultValues?: ContractorCreate;
  submitLabel?: string;
}) {
  const { data: filterOptions, error: filterOptionsError } = useSWR(
    "/api/contractors/filter/",
    fetchContractorFilterOptions
  );
  const { control, register, handleSubmit, setValue, formState, trigger } =
    useForm<ContractorCreate>({
      resolver: zodResolver(validationSchema),
      mode: "onBlur",
      reValidateMode: "onBlur",
      defaultValues,
    });
  const { errors, isValid } = formState;

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
    <form className="flex flex-col gap-2">
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
            "circular_service_types",
            "Select Circular Services...",
            filterOptions?.circular_service_types || []
          )}
        </div>
        <div className="flex flex-col gap-2">
          {onCancel && (
            <Button variant="secondary" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
          {onDelete && (
            <Button variant="danger" size="sm" onClick={onDelete}>
              Delete
            </Button>
          )}
          <Button
            variant={isValid ? "primary" : "disabled"}
            size="sm"
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid}
          >
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}

export function ContractorCreateForm({
  onSuccess,
}: {
  onSuccess?: () => void | Promise<void>;
}) {
  const onSubmit = async (values: ContractorCreate) => {
    try {
      console.log(`createContractor to backend: ${JSON.stringify(values)}`);
      await createContractor(values);
      await onSuccess?.();
    } catch (err) {
      console.error(err);
    }
  };

  return <ContractorBaseForm onSubmit={onSubmit} />;
}

export function ContractorEditForm({
  onCancel,
  onSuccess,
  onDeleted,
  defaultValues,
  dataId,
}: EditFormProps) {
  const onSubmit = async (values: ContractorCreate) => {
    try {
      console.log(`editContractor to backend: ${JSON.stringify(values)}`);
      await updateContractor(dataId, values);
      await onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update contractor");
    }
  };

  const onDelete = async () => {
    try {
      await deleteContractor(dataId);
      await onDeleted?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete contractor");
    }
  };

  return (
    <ContractorBaseForm
      onSubmit={onSubmit}
      onCancel={onCancel}
      onDelete={onDelete}
      defaultValues={defaultValues}
      submitLabel="Update"
    />
  );
}
