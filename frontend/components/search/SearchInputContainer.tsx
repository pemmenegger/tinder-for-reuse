import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState, KeyboardEvent } from "react";
import { Button } from "../ui/button";
import SearchInputText from "./SearchInputText";
import { SearchRequest } from "@/types/api/search";
import { Select } from "../ui/select";

export type FilterOption = {
  id: number | string;
  discriminator: string;
  type_id: number | string;
  type_label: string;
};

export type FilterConfig = {
  type: "single" | "multi";
  label: string;
  path: string[];
  options?: FilterOption[];
};

export default function SearchContainer<ReqT extends SearchRequest>({
  searchRequest,
  setSearchRequest,
  totalResults,
  filterConfigs,
}: {
  searchRequest: ReqT;
  setSearchRequest: (searchProps: ReqT) => void;
  totalResults: number;
  filterConfigs: Record<string, FilterConfig[]>;
}) {
  const [newSearchRequest, setNewSearchRequest] = useState<ReqT>(searchRequest);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const { text: queryText } = newSearchRequest.query;

  const handleKeyDown = (e: KeyboardEvent<HTMLImageElement>) => {
    if (e.key === "Enter") {
      handleSearchButton();
    }
  };

  const handleSearchButton = async () => {
    setSearchRequest(newSearchRequest);
  };

  const handleInputChange = (path: string[], value: any) => {
    let updatedProps: any = { ...newSearchRequest };

    // Dynamically set the nested property value
    path.reduce((obj, key, index) => {
      if (index === path.length - 1) {
        obj[key] = value;
      } else {
        obj[key] = obj[key] || {};
      }
      return obj[key];
    }, updatedProps);

    setNewSearchRequest(updatedProps);
  };

  const onTextChange = (text: string) => {
    handleInputChange(["query", "text"], text !== "" ? text : undefined);
  };

  function getValueAtPath<ReqT extends SearchRequest>(
    searchRequest: ReqT,
    path: string[]
  ): any {
    // Navigate through the searchRequest using the path
    return path.reduce((obj, key) => {
      // Type assertion to tell TypeScript that obj can be indexed with a string key
      return (obj as any)[key];
    }, searchRequest as any);
  }

  const renderFilterUI = (config: FilterConfig) => {
    if (!config.options) {
      return null;
    }
    switch (config.type) {
      case "single":
        return (
          <Select
            options={config.options}
            selectedOptions={config.options.filter((option) =>
              getValueAtPath<ReqT>(searchRequest, config.path).includes(
                option.id
              )
            )}
            onChange={(selectedOptions) => {
              const id = selectedOptions.map((option) => option.id);
              handleInputChange(config.path, id);
            }}
            isMultiSelect={false}
          />
        );
      case "multi":
        return (
          <Select
            options={config.options}
            selectedOptions={config.options.filter((option) =>
              getValueAtPath<ReqT>(searchRequest, config.path).includes(
                option.id
              )
            )}
            // selectedOptions={config.options}
            onChange={(selectedOptions) => {
              const ids = selectedOptions.map((option) => option.id);
              handleInputChange(config.path, ids);
            }}
            isMultiSelect={true}
          />
        );
      default:
        return null;
    }
  };

  const renderConfigItem = (config: FilterConfig, configKey: string) => (
    <div key={configKey} className="mb-4">
      <p className="text-sm font-body-400 mb-2">{config.label}</p>
      {renderFilterUI(config)}
    </div>
  );

  const renderFilterConfigs = () => {
    return (
      <div className="flex flex-col gap-4">
        {Object.entries(filterConfigs).map(([key, configs], index) => (
          <div key={key} className="mb-4">
            {Object.keys(filterConfigs).length > 1 && (
              <p className="text-md font-body-500 mb-3">{key}</p>
            )}

            {configs.map((config, configIndex) =>
              renderConfigItem(config, `${key}-${configIndex}`)
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full mb-6 md:mb-6">
      <div className="flex pb-10">
        <div className="relative w-full lg:mt-[42px]" onKeyDown={handleKeyDown}>
          <SearchInputText queryText={queryText} onTextChange={onTextChange} />
          <div className="flex absolute right-2 top-2 justify-right">
            <Button
              variant="primary"
              size="lg"
              className="ml-2"
              onClick={handleSearchButton}
            >
              Search
            </Button>
          </div>
        </div>
      </div>
      <div>
        <div className="mb-0 border border-dgray/75 rounded-xl px-4 py-4 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div
            className="w-full flex justify-between items-start cursor-pointer"
            onClick={() => setIsFilterVisible(!isFilterVisible)}
          >
            <p
              className={`text-md ${
                isFilterVisible ? "font-body-500 mb-3" : "font-body-400 mb-0"
              }`}
            >
              Filter Items ({totalResults} Found)
            </p>
            <ChevronDownIcon className="w-6" />
          </div>
          <div className={`${isFilterVisible ? "block" : "hidden"}`}>
            {renderFilterConfigs()}
          </div>
        </div>
      </div>
    </div>
  );
}
