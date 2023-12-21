import {
  ArrowUturnDownIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useState, KeyboardEvent } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import SearchInputText from "./SearchInputText";
import SearchInputImage from "./SearchInputImage";
import { SearchRequest } from "./SearchResults";
import { SearchInputSelect } from "./SearchInputSelect";

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
  filterConfigs: FilterConfig[];
}) {
  const [newSearchRequest, setNewSearchRequest] = useState<ReqT>(searchRequest);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const { image: queryImage, text: queryText } = newSearchRequest.query;
  const isImageAllowed = queryImage !== undefined;

  const handleKeyDown = (e: KeyboardEvent<HTMLImageElement>) => {
    if (e.key === "Enter") {
      handleSearchButton();
    }
  };

  const handleSearchButton = async () => {
    // if (!queryImage && !queryText) {
    //   toast.error("Please provide either an image or a text for the search");
    //   return;
    // }
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

  const onImageChange = (image: string) => {
    handleInputChange(["query", "image"], image);
    handleInputChange(["filter", "embedding_type"], "IMAGE_ONLY");
  };

  const onImageRemove = () => {
    handleInputChange(["query", "image"], undefined);
  };

  const renderFilterUI = (config: FilterConfig) => {
    switch (config.type) {
      case "single":
        return (
          <SearchInputSelect
            options={config.options || []}
            onChange={(selectedOptions) => {
              const value =
                selectedOptions.length > 0 ? selectedOptions[0].type_id : null;
              handleInputChange(config.path, value);
            }}
            multiSelect={false}
          />
        );
      case "multi":
        return (
          <SearchInputSelect
            options={config.options || []}
            onChange={(selectedOptions) => {
              const value = selectedOptions.map((option) => option.type_id);
              handleInputChange(config.path, value);
            }}
            multiSelect={true}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full mb-6 md:mb-6">
      <div className="flex pb-10">
        <div className="relative w-full lg:mt-[42px]" onKeyDown={handleKeyDown}>
          {isImageAllowed && (
            <p className="hidden lg:block absolute right-[135px] top-[-42px] font-head-400 tracking-wide text-base text-dgray/80">
              <span>Tip: Search by Using a Photo!</span>
              <ArrowUturnDownIcon className="w-6 ml-2 inline" />
            </p>
          )}
          <SearchInputText queryText={queryText} onTextChange={onTextChange} />
          <div className="flex absolute right-2 top-2 justify-right">
            {isImageAllowed && (
              <SearchInputImage
                queryImage={queryImage}
                onImageChange={onImageChange}
                onImageRemove={onImageRemove}
              />
            )}
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
            {filterConfigs.map((config, index) => {
              return (
                <div key={index} className="mb-4">
                  <p className="text-sm font-body-400 mb-2">{config.label}</p>
                  {renderFilterUI(config)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
