import {
  collectorsFetcher,
  fetchCollectorFilterOptions,
} from "@/lib/api/collectors";
import { CollectorRead } from "@/types/api/collector";
import { useEffect, useState } from "react";
import Search, { SearchResultsWrapperType } from "@/components/search/Search";
import SearchWithMapResultsWrapper from "@/components/search/SearchWithMapResultsWrapper";
import { MapMarker } from "@/types/item";
import { fromCollectorsToCollectorMapMarkers } from "@/lib/utils";
import useSWR from "swr";

export default function CollectorsPage() {
  const { data: filterOptions, error } = useSWR(
    "/api/collectors/filter/",
    fetchCollectorFilterOptions
  );

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Search
      fetcher={collectorsFetcher}
      initialSearchRequest={{
        query: {
          text: "",
        },
        filter: {
          material_type_ids: [],
          waste_code_type_ids: [],
          authorized_vehicle_type_ids: [],
          circular_strategy_type_ids: [],
        },
      }}
      filterConfigs={[
        {
          type: "multi",
          label: "Materials",
          path: ["filter", "material_type_ids"],
          options: filterOptions?.material_types,
        },
        {
          type: "multi",
          label: "Waste Codes",
          path: ["filter", "waste_code_type_ids"],
          options: filterOptions?.waste_code_types,
        },
        {
          type: "multi",
          label: "Authorized Vehicles",
          path: ["filter", "authorized_vehicle_type_ids"],
          options: filterOptions?.authorized_vehicle_types,
        },
        {
          type: "multi",
          label: "Circular Strategies",
          path: ["filter", "circular_strategy_type_ids"],
          options: filterOptions?.circular_strategy_types,
        },
      ]}
      ResultsWrapper={CollectorResultsWrapper}
    />
  );
}

function CollectorResultsWrapper({
  results,
  isLoading,
}: SearchResultsWrapperType) {
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);

  useEffect(() => {
    const collectors = results as CollectorRead[];

    if (!collectors || collectors.length === 0) {
      return;
    }

    const collectorsMapMarkers =
      fromCollectorsToCollectorMapMarkers(collectors);

    setMapMarkers(collectorsMapMarkers);
  }, [results]);

  return (
    <SearchWithMapResultsWrapper
      isLoading={isLoading}
      mapMarkers={mapMarkers}
      clusterIconUrl="/icons/collectors/cluster.svg"
    />
  );
}
