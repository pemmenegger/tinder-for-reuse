import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { FilterOption } from "../search/SearchInputContainer";
import { useEffect, useRef, useState } from "react";

const selectVariants = cva(
  "cursor-pointer w-full bg-white border text-black text-left",
  {
    variants: {
      size: {
        sm: "py-3 text-sm px-4 rounded-lg font-body-400 text-sm shadow-sm",
        xl: "py-5 text-md px-6 rounded-xl font-body-400 text-lg shadow-md",
      },
      isOpen: {
        true: "ring-1 ring-indigo-500 border-indigo-500",
        false: "border-dgray",
      },
      isEmpty: {
        true: "text-gray-400",
        false: "",
      },
    },
    defaultVariants: {
      size: "sm",
      isOpen: false,
    },
  }
);

const optionVariants = cva("cursor-pointer select-none relative pl-10", {
  variants: {
    size: {
      sm: "py-3 text-sm pr-4 font-body-400",
      xl: "py-5 text-lg pr-4 font-body-400",
    },
    isSelected: {
      true: "bg-indigo-100",
      false: "",
    },
  },
  defaultVariants: {
    size: "sm",
    isSelected: false,
  },
});

export interface SelectProps extends VariantProps<typeof selectVariants> {
  options: FilterOption[];
  selectedOptions: FilterOption[];
  placeholder?: string;
  onChange: (selectedOptions: FilterOption[]) => void;
  isMultiSelect?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  options,
  selectedOptions,
  placeholder = "Select...",
  onChange,
  isMultiSelect = false,
  size,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element;
    if (selectRef.current && !selectRef.current.contains(target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleOption = (option: FilterOption) => {
    let newSelectedOptions;
    if (isMultiSelect) {
      if (isSelected(option)) {
        newSelectedOptions = selectedOptions.filter(
          (selectedOption) => selectedOption.type_id !== option.type_id
        );
      } else {
        newSelectedOptions = [...selectedOptions, option];
      }
    } else {
      newSelectedOptions = [option];
    }
    onChange(newSelectedOptions);
  };

  const isSelected = (option: FilterOption) => {
    return selectedOptions.some(
      (selectedOption) => selectedOption.type_id === option.type_id
    );
  };

  const isEmpty = selectedOptions.length === 0;

  return (
    <div ref={selectRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(selectVariants({ size, isOpen, isEmpty, ...props }))}
      >
        {isEmpty
          ? placeholder
          : selectedOptions.map((option) => option.type_label).join(", ")}
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md text-base overflow-auto focus:outline-none sm:text-sm">
          {options.map((option) => (
            <li
              key={option.id}
              onClick={() => toggleOption(option)}
              className={cn(optionVariants({ isSelected: isSelected(option) }))}
            >
              <span className={`block truncate`}>{option.type_label}</span>
              {isSelected(option) && (
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 011.414 0l-8 8-4-4a1 1 0 111.414-1.414l3.293 3.293 7.293-7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
