import React, { useState, useEffect } from "react";
import Search, { SearchResultsWrapperType } from "@/components/search/Search";
import { fetchBuildingElementFilterOptions } from "@/lib/api/building-elements";
import {
  BuildingElementFilterOptions,
  BuildingElementMatchesRead,
} from "@/types/api/items/building-element";
import { buildingElementMatchesFetcher } from "@/lib/api/building-elements";
import SearchWithMapResultsWrapper from "@/components/search/SearchWithMapResultsWrapper";
import { MapMarker } from "@/types/item";
import {
  fromBuildingElementsToBuildingElementsMapMarkers,
  fromCollectorsToCollectorMapMarkers,
} from "@/lib/utils";

export default function BuildingElementMatchesPage() {
  const [filterProperties, setFilterProperties] =
    useState<BuildingElementFilterOptions>({
      worksheet_types: [],
      unit_types: [],
      material_types: [],
      health_status_types: [],
      reuse_potential_types: [],
      waste_code_types: [],
      recycling_potential_types: [],
    });

  useEffect(() => {
    async function getFilterProperties() {
      try {
        const properties = await fetchBuildingElementFilterOptions();
        setFilterProperties(properties);
      } catch (error) {
        console.error(
          "Failed to fetch building element filter properties:",
          error
        );
      }
    }

    getFilterProperties();
  }, []);

  return (
    <Search
      fetcher={buildingElementMatchesFetcher}
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
      filterConfigs={[
        {
          type: "multi",
          label: "Worksheets",
          path: ["filter", "worksheet_type_ids"],
          options: filterProperties.worksheet_types,
        },
        {
          type: "multi",
          label: "Units",
          path: ["filter", "unit_type_ids"],
          options: filterProperties.unit_types,
        },
        {
          type: "multi",
          label: "Materials",
          path: ["filter", "material_type_ids"],
          options: filterProperties.material_types,
        },
        {
          type: "multi",
          label: "Health Status",
          path: ["filter", "health_status_type_ids"],
          options: filterProperties.health_status_types,
        },
        {
          type: "multi",
          label: "Reuse Potential",
          path: ["filter", "reuse_potential_type_ids"],
          options: filterProperties.reuse_potential_types,
        },
        {
          type: "multi",
          label: "Waste Codes",
          path: ["filter", "waste_code_type_ids"],
          options: filterProperties.waste_code_types,
        },
        {
          type: "multi",
          label: "Recycling Potential",
          path: ["filter", "recycling_potential_type_ids"],
          options: filterProperties.recycling_potential_types,
        },
      ]}
      ResultsWrapper={BuildingElementMatchesResultsWrapper}
    />
  );
}

function BuildingElementMatchesResultsWrapper({
  results,
  isLoading,
}: SearchResultsWrapperType) {
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);

  useEffect(() => {
    const buildingElementMatches = results as BuildingElementMatchesRead[];

    if (!buildingElementMatches || buildingElementMatches.length === 0) {
      return;
    }

    const buildingElements = buildingElementMatches[0].building_elements_read;
    const collectors = buildingElementMatches[0].collectors_read;

    if (
      !buildingElements ||
      !collectors ||
      buildingElements.length === 0 ||
      collectors.length === 0
    ) {
      return;
    }

    const buildingElementsMapMarkers =
      fromBuildingElementsToBuildingElementsMapMarkers(buildingElements);
    const collectorsMapMarkers =
      fromCollectorsToCollectorMapMarkers(collectors);

    setMapMarkers([...buildingElementsMapMarkers, ...collectorsMapMarkers]);
  }, [results]);

  return (
    <SearchWithMapResultsWrapper
      isLoading={isLoading}
      mapMarkers={mapMarkers}
    />
  );
}
