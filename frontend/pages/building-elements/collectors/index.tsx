import {
  collectorsFetcher,
  deleteAllCollectors,
  fetchCollectorFilterOptions,
} from "@/lib/api/collectors";
import { useEffect, useState } from "react";
import Search, { SearchResultsWrapperType } from "@/components/search/Search";
import SearchWithMapResultsWrapper from "@/components/search/SearchWithMapResultsWrapper";
import { MapMarker } from "@/types/map";
import { generateCollectorMapMarkers } from "@/lib/utils";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { CollectorRead } from "@/types/api/collector";

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
      filterConfigs={{
        Collector: [
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
        ],
      }}
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

    const collectorsMapMarkers = generateCollectorMapMarkers(collectors);

    setMapMarkers(collectorsMapMarkers);
  }, [results]);

  return (
    <>
      <SearchWithMapResultsWrapper
        isLoading={isLoading}
        mapMarkers={mapMarkers}
        clusterIconUrl="/icons/collectors/cluster.svg"
      />
      {mapMarkers.length > 0 && (
        <Button
          variant="danger"
          size="sm"
          className="mt-8"
          onClick={async () => {
            try {
              await deleteAllCollectors();
              toast.success("Successfully deleted all collectors");
              window.location.reload();
            } catch (error) {
              console.error(error);
              toast.error("Failed to delete all collectors");
            }
          }}
        >
          Delete All Collectors
        </Button>
      )}
    </>
  );
}
