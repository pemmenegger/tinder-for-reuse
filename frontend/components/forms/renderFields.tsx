import React, { HTMLInputTypeAttribute } from "react";
import { Input } from "@/components/ui/input";
import {
  Controller,
  Control,
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
  PathValue,
  UseFormTrigger,
  UseFormSetValue,
} from "react-hook-form";
import { Select } from "../ui/select";
import { FilterOption } from "../search/SearchInputContainer";

interface RenderInputProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  label: Path<T>;
  placeholder: string;
  type?: HTMLInputTypeAttribute;
}

export const renderInput = <T extends FieldValues>({
  register,
  errors,
  label,
  placeholder,
  type,
}: RenderInputProps<T>) => {
  const error = errors[label]?.message as string;

  return (
    <div className="w-full">
      <Input {...register(label)} placeholder={placeholder} type={type} />
      {error && <p className="px-2.5 pt-1.5 text-sm text-red">{error}</p>}
    </div>
  );
};

interface RenderSelectProps<T extends FieldValues> {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  trigger: UseFormTrigger<T>;
  errors: FieldErrors<T>;
  label: Path<T>;
  placeholder: string;
  options: FilterOption[];
}

export const renderSelect = <T extends FieldValues>({
  control,
  setValue,
  trigger,
  errors,
  label,
  placeholder,
  options,
}: RenderSelectProps<T>) => {
  const error = errors[label]?.message as string;

  return (
    <div className="w-full">
      <Controller
        control={control}
        name={label}
        render={({ field: { value } }) => (
          <>
            <Select
              options={options}
              selectedOptions={options.filter((option) =>
                value?.includes(option.type_label)
              )}
              placeholder={placeholder}
              onChange={(selectedOptions) => {
                const newValue = selectedOptions.map(
                  (option) => option.type_label
                ) as PathValue<T, Path<T>>;
                setValue(label, newValue, { shouldValidate: true });
                trigger(label);
              }}
              isMultiSelect={true}
            />
            {error && <p className="px-2.5 pt-1.5 text-sm text-red">{error}</p>}
          </>
        )}
      />
    </div>
  );
};
