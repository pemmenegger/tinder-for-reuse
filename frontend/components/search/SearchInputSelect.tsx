import React, { useState } from "react";
import { FilterOption } from "./SearchInputContainer";

interface SearchInputSelectProps {
  options: FilterOption[];
  placeholder?: string;
  onChange: (selectedOptions: FilterOption[]) => void;
  multiSelect?: boolean;
}

export const SearchInputSelect: React.FC<SearchInputSelectProps> = ({
  options,
  placeholder = "Select...",
  onChange,
  multiSelect = false,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<FilterOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (option: FilterOption) => {
    setSelectedOptions((currentSelectedOptions) => {
      if (multiSelect) {
        // Multi-select behavior
        const isSelected = currentSelectedOptions.some(
          (selectedOption) => selectedOption.id === option.id
        );

        const newSelectedOptions = isSelected
          ? currentSelectedOptions.filter(
              (selectedOption) => selectedOption.id !== option.id
            )
          : [...currentSelectedOptions, option];

        onChange(newSelectedOptions); // Trigger the callback with the new selected items
        return newSelectedOptions;
      } else {
        // Single select behavior
        const newSelectedOptions = [option];
        onChange(newSelectedOptions); // Trigger the callback with the new selected item
        return newSelectedOptions;
      }
    });
  };

  const isSelected = (option: FilterOption) => {
    return selectedOptions.some(
      (selectedOption) => selectedOption.id === option.id
    );
  };
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        {selectedOptions.length > 0
          ? selectedOptions.map((option) => option.type_label).join(", ")
          : placeholder}
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md text-base overflow-auto focus:outline-none sm:text-sm">
          {options.map((option) => (
            <li
              key={option.id}
              onClick={() => toggleOption(option)}
              className={`cursor-default select-none relative py-2 pl-10 pr-4 ${
                isSelected(option) ? "bg-indigo-100" : ""
              }`}
            >
              <span
                className={`block truncate ${
                  isSelected(option) ? "font-medium" : "font-normal"
                }`}
              >
                {option.type_label}
              </span>
              {isSelected(option) && (
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                  {/* You can replace this with an icon */}
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
