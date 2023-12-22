import { CollectorRead, CollectorSearchRequest } from "@/types/api/collector";
import {
  ContractorRead,
  ContractorSearchRequest,
} from "@/types/api/contractor";
import {
  BuildingElementSearchRequest,
  BuildingElementUploadRead,
  MatchesSearchRequest,
} from "@/types/api/building-element";
import { SearchResponse } from "@/types/api/search";
import { buildingElementUploadsFetcher } from "./building-elements";
import { collectorsFetcher } from "./collectors";
import { contractorsFetcher } from "./contractors";

export type MatchesRead = {
  building_element_uploads: BuildingElementUploadRead[];
  collectors: CollectorRead[];
  contractors: ContractorRead[];
};

export const matchesFetcher = async (
  searchRequest: MatchesSearchRequest
): Promise<SearchResponse<MatchesRead>> => {
  const buildingElementSearchRequest: BuildingElementSearchRequest = {
    query: searchRequest.query,
    filter: searchRequest.filter.building_element,
  };
  const buildingElementUploads = await buildingElementUploadsFetcher(
    buildingElementSearchRequest
  );

  const collectorSearchRequest: CollectorSearchRequest = {
    query: searchRequest.query,
    filter: searchRequest.filter.collector,
  };
  const collectors = await collectorsFetcher(collectorSearchRequest);

  const contractorSearchRequest: ContractorSearchRequest = {
    query: searchRequest.query,
    filter: searchRequest.filter.contractor,
  };
  const contractors = await contractorsFetcher(contractorSearchRequest);

  return {
    results: [
      {
        building_element_uploads: buildingElementUploads.results,
        collectors: collectors.results,
        contractors: contractors.results,
      },
    ],
  };
};
