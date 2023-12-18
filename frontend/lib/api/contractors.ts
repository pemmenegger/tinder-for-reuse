import {
  ContractorCreate,
  ContractorFilterOptions,
  ContractorRead,
  ContractorSearchRequest,
  ContractorSearchResponse,
} from "@/types/api/contractor";
import { ApiError, fetchApi } from "./base";

const API_ROUTE = "/api/contractors";

export const createContractor = async (
  contractor: ContractorCreate
): Promise<ContractorRead> => {
  const { response, data } = await fetchApi(API_ROUTE, `/`, {
    method: "POST",
    body: [contractor],
  });
  if (!response.ok) throw new ApiError("createContractor fehlgeschlagen", data);
  console.log("createContractor Response", data);
  return data;
};

export const fetchContractors = async (): Promise<ContractorRead[]> => {
  const { response, data } = await fetchApi(API_ROUTE, `/`, {
    method: "GET",
  });
  if (!response.ok) throw new ApiError("fetchContractors fehlgeschlagen", data);
  // console.log("fetchContractors Response", data);
  return data;
};

export const fetchContractorFilterOptions =
  async (): Promise<ContractorFilterOptions> => {
    const { response, data } = await fetchApi(API_ROUTE, `/filter/`, {
      method: "GET",
    });
    if (!response.ok)
      throw new ApiError("fetchContractorFilterOptions fehlgeschlagen", data);
    console.log("fetchContractorFilterOptions Response", data);
    return data;
  };

export const contractorsFetcher = async (
  searchRequest: ContractorSearchRequest
): Promise<ContractorSearchResponse> => {
  const { response, data } = await fetchApi(API_ROUTE, `/search`, {
    method: "POST",
    body: searchRequest,
  });
  if (!response.ok) throw new ApiError("Fetching contractors failed", data);
  console.log("ContractorsFetcher Response", data);
  return data;
};
