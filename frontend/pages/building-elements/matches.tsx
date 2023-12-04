import {
  collectorsFetcher,
  fetchCollectorFilterOptions,
} from "@/lib/api/collectors";
import { CollectorFilterOptions } from "@/types/api/collector";

import { useEffect, useState } from "react";
import Search from "@/components/search/Search";
// import { SearchWithMapResultsWrapper } from "@/components/search/resultsWrappers";

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

  return <p>to be defined</p>;
}
