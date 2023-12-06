import React, { useState, useEffect } from "react";
import Search, { SearchResultsWrapperType } from "@/components/search/Search";
import { fetchBuildingElementFilterOptions } from "@/lib/api/items/building-elements";
import {
  BuildingElementFilterOptions,
  BuildingElementMatchesRead,
} from "@/types/api/items/building-element";
import { buildingElementMatchesFetcher } from "@/lib/api/items/building-elements";
import SearchWithMapResultsWrapper from "@/components/search/SearchWithMapResultsWrapper";
import { MapMarker } from "@/types/item";
import {
  fromBuildingElementsToBuildingElementsMapMarkers,
  fromCollectorsToCollectorMapMarkers,
} from "@/lib/utils";

export default function BuildingElementMatchesPage() {
  const [filterProperties, setFilterProperties] =
    useState<BuildingElementFilterOptions>({
      unit_types: [],
      category_types: [],
      constitution_types: [],
      material_types: [],
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
          unit_type_ids: [],
          category_type_ids: [],
          constitution_type_ids: [],
          material_type_ids: [],
        },
      }}
      filterConfigs={[
        {
          type: "multi",
          label: "Units",
          path: ["filter", "unit_type_ids"],
          options: filterProperties.unit_types,
        },
        {
          type: "multi",
          label: "Categories",
          path: ["filter", "category_type_ids"],
          options: filterProperties.category_types,
        },
        {
          type: "multi",
          label: "Constitutions",
          path: ["filter", "constitution_type_ids"],
          options: filterProperties.constitution_types,
        },
        {
          type: "multi",
          label: "Materials",
          path: ["filter", "material_type_ids"],
          options: filterProperties.material_types,
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
