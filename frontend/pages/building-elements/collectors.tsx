import {
  collectorsFetcher,
  fetchCollectorFilterOptions,
} from "@/lib/api/collectors";
import { CollectorFilterOptions, CollectorRead } from "@/types/api/collector";

import { useEffect, useState } from "react";
import Search, { SearchResultsWrapperType } from "@/components/search/Search";

import SearchWithMapResultsWrapper, {
  MapMarker,
} from "@/components/search/SearchWithMapResultsWrapper";
import {
  CollectorCard,
  CollectorCardSkeleton,
} from "@/components/CollectorCard";

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
  const collectors = results as CollectorRead[];

  const mapMarkers: MapMarker[] = collectors.map((collector) => ({
    iconUrl: "/icons/marker-collector.svg",
    iconScaledSize: {
      width: 22,
      height: 31,
    },
    ...collector,
  }));

  return (
    <SearchWithMapResultsWrapper
      isLoading={isLoading}
      mapMarkers={mapMarkers}
      ResultsComponent={CollectorCard}
      LoadingSkeletonComponent={CollectorCardSkeleton}
    />
  );
}
