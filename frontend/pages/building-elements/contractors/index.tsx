import {
  contractorsFetcher,
  fetchContractorFilterOptions,
} from "@/lib/api/contractors";
import { ContractorRead } from "@/types/api/contractor";
import { useEffect, useState } from "react";
import Search, { SearchResultsWrapperType } from "@/components/search/Search";
import SearchWithMapResultsWrapper from "@/components/search/SearchWithMapResultsWrapper";
import { MapMarker } from "@/types/item";
import { fromContractorsToContractorMapMarkers } from "@/lib/utils";
import { useFilterOptions } from "@/components/hooks/useFilterOptions";

export default function ContractorsPage() {
  const { filterOptions, error } = useFilterOptions(
    fetchContractorFilterOptions
  );

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Search
      fetcher={contractorsFetcher}
      initialSearchRequest={{
        query: {
          text: "",
        },
        filter: {
          material_type_ids: [],
          waste_code_type_ids: [],
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
          path: ["filter", "waste_code_types"],
          options: filterOptions?.waste_code_types,
        },
      ]}
      ResultsWrapper={ContractorResultsWrapper}
    />
  );
}

function ContractorResultsWrapper({
  results,
  isLoading,
}: SearchResultsWrapperType) {
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);

  useEffect(() => {
    const contractors = results as ContractorRead[];

    if (!contractors || contractors.length === 0) {
      return;
    }

    const contractorsMapMarkers =
      fromContractorsToContractorMapMarkers(contractors);

    setMapMarkers(contractorsMapMarkers);
  }, [results]);

  return (
    <SearchWithMapResultsWrapper
      isLoading={isLoading}
      mapMarkers={mapMarkers}
      clusterIconUrl="/icons/contractors/cluster.svg"
    />
  );
}
