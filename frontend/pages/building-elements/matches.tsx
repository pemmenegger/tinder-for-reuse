import React, { useState, useEffect } from "react";
import Search, { SearchResultsWrapperType } from "@/components/search/Search";
import { fetchBuildingElementFilterOptions } from "@/lib/api/building-elements";

import SearchWithMapResultsWrapper from "@/components/search/SearchWithMapResultsWrapper";
import {
  generateBuildingElementUploadMapMarkers,
  generateCollectorMapMarkers,
  generateContractorMapMarkers,
} from "@/lib/utils";
import { MapMarker } from "@/types/map";
import useSWR from "swr";
import { fetchCollectorFilterOptions } from "@/lib/api/collectors";
import { fetchContractorFilterOptions } from "@/lib/api/contractors";
import { MatchesRead, matchesFetcher } from "@/lib/api/matches";

export default function BuildingElementItemsPage() {
  const { data: buildingElementFilterOptions, error: buildingElementError } =
    useSWR("/api/building-elements/filter/", fetchBuildingElementFilterOptions);
  const { data: collectorFilterOptions, error: collectorError } = useSWR(
    "/api/collectors/filter/",
    fetchCollectorFilterOptions
  );
  const { data: contractorFilterOptions, error: contractorError } = useSWR(
    "/api/contractors/filter/",
    fetchContractorFilterOptions
  );

  const filterOptions = {
    building_element: buildingElementFilterOptions,
    collector: collectorFilterOptions,
    contractor: contractorFilterOptions,
  };

  if (buildingElementError || collectorError || contractorError) {
    return (
      <div>{buildingElementError || collectorError || contractorError}</div>
    );
  }

  return (
    <Search
      fetcher={matchesFetcher}
      initialSearchRequest={{
        query: {
          text: "",
        },
        filter: {
          building_element: {
            worksheet_type_ids: [],
            unit_type_ids: [],
            material_type_ids: [],
            health_status_type_ids: [],
            reuse_potential_type_ids: [],
            waste_code_type_ids: [],
            recycling_potential_type_ids: [],
          },
          collector: {
            material_type_ids: [],
            waste_code_type_ids: [],
            authorized_vehicle_type_ids: [],
            circular_strategy_type_ids: [],
          },
          contractor: {
            material_type_ids: [],
            waste_code_type_ids: [],
            circular_service_type_ids: [],
          },
        },
      }}
      filterConfigs={{
        "Building Element": [
          {
            type: "multi",
            label: "Worksheets",
            path: ["filter", "building_element", "worksheet_type_ids"],
            options: filterOptions?.building_element?.worksheet_types,
          },
          {
            type: "multi",
            label: "Units",
            path: ["filter", "building_element", "unit_type_ids"],
            options: filterOptions?.building_element?.unit_types,
          },
          {
            type: "multi",
            label: "Materials",
            path: ["filter", "building_element", "material_type_ids"],
            options: filterOptions?.building_element?.material_types,
          },
          {
            type: "multi",
            label: "Health Status",
            path: ["filter", "building_element", "health_status_type_ids"],
            options: filterOptions?.building_element?.health_status_types,
          },
          {
            type: "multi",
            label: "Reuse Potential",
            path: ["filter", "building_element", "reuse_potential_type_ids"],
            options: filterOptions?.building_element?.reuse_potential_types,
          },
          {
            type: "multi",
            label: "Waste Codes",
            path: ["filter", "building_element", "waste_code_type_ids"],
            options: filterOptions?.building_element?.waste_code_types,
          },
          {
            type: "multi",
            label: "Recycling Potential",
            path: [
              "filter",
              "building_element",
              "recycling_potential_type_ids",
            ],
            options: filterOptions?.building_element?.recycling_potential_types,
          },
        ],
        Collector: [
          {
            type: "multi",
            label: "Materials",
            path: ["filter", "collector", "material_type_ids"],
            options: filterOptions?.collector?.material_types,
          },
          {
            type: "multi",
            label: "Waste Codes",
            path: ["filter", "collector", "waste_code_type_ids"],
            options: filterOptions?.collector?.waste_code_types,
          },
          {
            type: "multi",
            label: "Authorized Vehicles",
            path: ["filter", "collector", "authorized_vehicle_type_ids"],
            options: filterOptions?.collector?.authorized_vehicle_types,
          },
          {
            type: "multi",
            label: "Circular Strategies",
            path: ["filter", "collector", "circular_strategy_type_ids"],
            options: filterOptions?.collector?.circular_strategy_types,
          },
        ],
        Contractor: [
          {
            type: "multi",
            label: "Materials",
            path: ["filter", "contractor", "material_type_ids"],
            options: filterOptions?.contractor?.material_types,
          },
          {
            type: "multi",
            label: "Waste Codes",
            path: ["filter", "contractor", "waste_code_type_ids"],
            options: filterOptions?.contractor?.waste_code_types,
          },
          {
            type: "multi",
            label: "Circular Services",
            path: ["filter", "contractor", "circular_service_type_ids"],
            options: filterOptions?.contractor?.circular_service_types,
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
    const matches = results as MatchesRead[];
    if (!matches || matches.length === 0) {
      return;
    }

    const buildingElementUploads = matches[0].building_element_uploads;
    const collectors = matches[0].collectors;
    const contractors = matches[0].contractors;

    let buildingElementUploadsMapMarkers: MapMarker[] = [];
    if (buildingElementUploads && buildingElementUploads.length > 0) {
      buildingElementUploadsMapMarkers =
        generateBuildingElementUploadMapMarkers(buildingElementUploads);
    }

    let collectorMapMarkers: MapMarker[] = [];
    if (collectors && collectors.length > 0) {
      collectorMapMarkers = generateCollectorMapMarkers(collectors);
    }

    let contractorMapMarkers: MapMarker[] = [];
    if (contractors && contractors.length > 0) {
      contractorMapMarkers = generateContractorMapMarkers(contractors);
    }

    setMapMarkers([
      ...buildingElementUploadsMapMarkers,
      ...collectorMapMarkers,
      ...contractorMapMarkers,
    ]);
  }, [results]);

  return (
    <SearchWithMapResultsWrapper
      isLoading={isLoading}
      mapMarkers={mapMarkers}
      clusterIconUrl="/icons/building-elements/cluster.svg"
    />
  );
}
