import React, { useState, useEffect } from "react";
import Search, { SearchResultsWrapperType } from "@/components/search/Search";
import { fetchBuildingElementFilterOptions } from "@/lib/api/items/building-elements";
import {
  BuildingElementFilterOptions,
  BuildingElementMatchesRead,
} from "@/types/api/items/building-element";
import { buildingElementMatchesFetcher } from "@/lib/api/items/building-elements";
import SearchWithMapResultsWrapper, {
  MapMarker,
} from "@/components/search/SearchWithMapResultsWrapper";
import {
  BuildingElementCard,
  BuildingElementCardSkeleton,
} from "@/components/BuildingElementCard";

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
  console.log(results);
  const buildingElementMatches = results as BuildingElementMatchesRead[];
  const buildingElementMatch = buildingElementMatches[0];

  const mapMarkers: MapMarker[] = [];

  if (buildingElementMatch) {
    // TODO group by upload uuid, only one pin per upload same upload uuid
    const buildingElementMapMarkers =
      buildingElementMatch.building_elements_read.map((buildingElement) => ({
        iconUrl: "/icons/marker-building-elements.svg",
        iconScaledSize: {
          width: 22,
          height: 31,
        },
        ...buildingElement,
      }));
    mapMarkers.push(...buildingElementMapMarkers);

    const collectorMapMarkers = buildingElementMatch.collectors_read.map(
      (collector) => ({
        iconUrl: "/icons/marker-collector.svg",
        iconScaledSize: {
          width: 22,
          height: 31,
        },
        ...collector,
      })
    );
    mapMarkers.push(...collectorMapMarkers);
  }

  return (
    <SearchWithMapResultsWrapper
      isLoading={isLoading}
      mapMarkers={mapMarkers}
      ResultsComponent={BuildingElementCard}
      LoadingSkeletonComponent={BuildingElementCardSkeleton}
    />
  );
}
