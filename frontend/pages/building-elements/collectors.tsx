import {
  collectorsFetcher,
  fetchCollectorFilterOptions,
} from "@/lib/api/collectors";
import { CollectorFilterOptions } from "@/types/api/collector";

import { useEffect, useState } from "react";
import Search from "@/components/search/Search";
import { CollectorResultsWrapper } from "@/components/search/resultsWrappers";

export default function CollectorsPage() {
  const [filterOptions, setFilterOptions] = useState<CollectorFilterOptions>({
    collection_types: [],
  });

  useEffect(() => {
    async function getfilterOptions() {
      try {
        const options = await fetchCollectorFilterOptions();
        setFilterOptions(options);
      } catch (error) {
        console.error("Failed to fetch collector filter options:", error);
      }
    }

    getfilterOptions();
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
