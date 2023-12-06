import {
  collectorsFetcher,
  fetchCollectorFilterOptions,
} from "@/lib/api/collectors";
import { CollectorFilterOptions, CollectorRead } from "@/types/api/collector";
import { useEffect, useState } from "react";
import Search, { SearchResultsWrapperType } from "@/components/search/Search";
import SearchWithMapResultsWrapper from "@/components/search/SearchWithMapResultsWrapper";
import { MapMarker } from "@/types/item";
import { fromCollectorsToCollectorMapMarkers } from "@/lib/utils";

export default function CollectorsPage() {
  const [filterOptions, setFilterOptions] = useState<CollectorFilterOptions>({
    collection_types: [],
  });

  useEffect(() => {
    async function getFilterOptions() {
      try {
        const options = await fetchCollectorFilterOptions();
        setFilterOptions(options);
      } catch (error) {
        console.error("Failed to fetch collector filter options:", error);
      }
    }

    getFilterOptions();
  }, []);

  return (
    <Search
      fetcher={collectorsFetcher}
      initialSearchRequest={{
        query: {
          text: "",
        },
        filter: {
          collection_type_ids: [],
        },
      }}
      filterConfigs={[
        {
          type: "multi",
          label: "Collections",
          path: ["filter", "collection_type_ids"],
          options: filterOptions.collection_types,
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
