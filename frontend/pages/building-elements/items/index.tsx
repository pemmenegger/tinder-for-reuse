import React, { useState, useEffect } from "react";
import Search, { SearchResultsWrapperType } from "@/components/search/Search";
import {
  buildingElementUploadsFetcher,
  deleteAllBuildingElements,
  fetchBuildingElementFilterOptions,
} from "@/lib/api/building-elements";
import { BuildingElementUploadRead } from "@/types/api/building-element";

import SearchWithMapResultsWrapper from "@/components/search/SearchWithMapResultsWrapper";
import { generateBuildingElementUploadMapMarkers } from "@/lib/utils";
import { MapMarker } from "@/types/map";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function BuildingElementItemsPage() {
  const { data: filterOptions, error } = useSWR(
    "/api/building-elements/filter/",
    fetchBuildingElementFilterOptions
  );

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Search
      fetcher={buildingElementUploadsFetcher}
      initialSearchRequest={{
        query: {
          text: "",
        },
        filter: {
          worksheet_type_ids: [],
          unit_type_ids: [],
          material_type_ids: [],
          health_status_type_ids: [],
          reuse_potential_type_ids: [],
          waste_code_type_ids: [],
          recycling_potential_type_ids: [],
        },
      }}
      filterConfigs={{
        "Building Element": [
          {
            type: "multi",
            label: "Worksheets",
            path: ["filter", "worksheet_type_ids"],
            options: filterOptions?.worksheet_types,
          },
          {
            type: "multi",
            label: "Units",
            path: ["filter", "unit_type_ids"],
            options: filterOptions?.unit_types,
          },
          {
            type: "multi",
            label: "Materials",
            path: ["filter", "material_type_ids"],
            options: filterOptions?.material_types,
          },
          {
            type: "multi",
            label: "Health Status",
            path: ["filter", "health_status_type_ids"],
            options: filterOptions?.health_status_types,
          },
          {
            type: "multi",
            label: "Reuse Potential",
            path: ["filter", "reuse_potential_type_ids"],
            options: filterOptions?.reuse_potential_types,
          },
          {
            type: "multi",
            label: "Waste Codes",
            path: ["filter", "waste_code_type_ids"],
            options: filterOptions?.waste_code_types,
          },
          {
            type: "multi",
            label: "Recycling Potential",
            path: ["filter", "recycling_potential_type_ids"],
            options: filterOptions?.recycling_potential_types,
          },
        ],
      }}
      ResultsWrapper={BuildingElementResultsWrapper}
    />
  );
}

function BuildingElementResultsWrapper({
  results,
  isLoading,
}: SearchResultsWrapperType) {
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);

  useEffect(() => {
    const buildingElementUploads = results as BuildingElementUploadRead[];

    if (!buildingElementUploads || buildingElementUploads.length === 0) {
      return;
    }

    const buildingElementUploadsMapMarkers =
      generateBuildingElementUploadMapMarkers(buildingElementUploads);

    setMapMarkers(buildingElementUploadsMapMarkers);
  }, [results]);

  return (
    <>
      <SearchWithMapResultsWrapper
        isLoading={isLoading}
        mapMarkers={mapMarkers}
        clusterIconUrl="/icons/building-elements/cluster.svg"
      />
      {mapMarkers.length > 0 && (
        <Button
          variant="danger"
          size="sm"
          className="mt-8"
          onClick={async () => {
            try {
              await deleteAllBuildingElements();
              toast.success("Successfully deleted all building elements");
              window.location.reload();
            } catch (error) {
              console.error(error);
              toast.error("Failed to delete all building elements");
            }
          }}
        >
          Delete All Building Elements
        </Button>
      )}
    </>
  );
}
