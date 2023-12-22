import {
  contractorsFetcher,
  deleteAllContractors,
  fetchContractorFilterOptions,
} from "@/lib/api/contractors";
import { ContractorRead } from "@/types/api/contractor";
import { useEffect, useState } from "react";
import Search, { SearchResultsWrapperType } from "@/components/search/Search";
import SearchWithMapResultsWrapper from "@/components/search/SearchWithMapResultsWrapper";
import { MapMarker } from "@/types/map";
import { generateContractorMapMarkers } from "@/lib/utils";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function ContractorsPage() {
  const { data: filterOptions, error } = useSWR(
    "/api/contractors/filter/",
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
          circular_service_type_ids: [],
        },
      }}
      filterConfigs={{
        Contractor: [
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
            label: "Circular Services",
            path: ["filter", "circular_service_type_ids"],
            options: filterOptions?.circular_service_types,
          },
        ],
      }}
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

    const contractorsMapMarkers = generateContractorMapMarkers(contractors);

    setMapMarkers(contractorsMapMarkers);
  }, [results]);

  return (
    <>
      <SearchWithMapResultsWrapper
        isLoading={isLoading}
        mapMarkers={mapMarkers}
        clusterIconUrl="/icons/contractors/cluster.svg"
      />
      {mapMarkers.length > 0 && (
        <Button
          variant="danger"
          size="sm"
          className="mt-8"
          onClick={async () => {
            try {
              await deleteAllContractors();
              toast.success("Successfully deleted all contractors");
              window.location.reload();
            } catch (error) {
              console.error(error);
              toast.error("Failed to delete all contractors");
            }
          }}
        >
          Delete All Contractors
        </Button>
      )}
    </>
  );
}
