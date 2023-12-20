import React, { useState, useEffect } from "react";
import Search, { SearchResultsWrapperType } from "@/components/search/Search";
import { fetchBuildingElementFilterOptions } from "@/lib/api/building-elements";
import {
  BuildingElementFilterOptions,
  BuildingElementRead,
} from "@/types/api/items/building-element";
import { buildingElementsFetcher } from "@/lib/api/building-elements";
import SearchWithMapResultsWrapper from "@/components/search/SearchWithMapResultsWrapper";
import { fromBuildingElementsToBuildingElementsMapMarkers } from "@/lib/utils";
import { MapMarker } from "@/types/item";

export default function BuildingElementItemsPage() {
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
      fetcher={buildingElementsFetcher}
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
    const buildingElements = results as BuildingElementRead[];

    if (!buildingElements || buildingElements.length === 0) {
      return;
    }

    const buildingElementsMapMarkers =
      fromBuildingElementsToBuildingElementsMapMarkers(buildingElements);

    setMapMarkers(buildingElementsMapMarkers);
  }, [results]);

  return (
    <SearchWithMapResultsWrapper
      isLoading={isLoading}
      mapMarkers={mapMarkers}
      clusterIconUrl="/icons/building-elements/cluster.svg"
    />
  );
}
