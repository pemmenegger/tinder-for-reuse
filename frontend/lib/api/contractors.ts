import {
  ContractorCreate,
  ContractorFilterOptions,
  ContractorRead,
  ContractorSearchRequest,
} from "@/types/api/contractor";
import { ApiError, fetchApi } from "../utils";
import { SearchResponse } from "@/types/api/search";

const API_ROUTE = "/api/contractors";

export const createContractor = async (
  contractor: ContractorCreate
): Promise<ContractorRead> => {
  const { response, data } = await fetchApi(API_ROUTE, `/`, {
    method: "POST",
    body: [contractor],
  });
  if (!response.ok) throw new ApiError("createContractor failed", data);
  // console.log("createContractor Response", data);
  return data;
};

export const updateContractor = async (
  contractorId: number,
  contractor: ContractorCreate
): Promise<ContractorCreate> => {
  const { response, data } = await fetchApi(API_ROUTE, `/${contractorId}`, {
    method: "PUT",
    body: contractor,
  });
  if (!response.ok) throw new ApiError("updateContractor failed", data);
  // console.log("updateContractor Response", data);
  return data;
};

export const deleteContractor = async (
  contractorId: number
): Promise<ContractorRead> => {
  const { response, data } = await fetchApi(API_ROUTE, `/${contractorId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new ApiError("deleteContractor failed", data);
  // console.log("deleteContractor Response", data);
  return data;
};

export const deleteAllContractors = async (): Promise<ContractorRead> => {
  const { response, data } = await fetchApi(API_ROUTE, `/`, {
    method: "DELETE",
  });
  if (!response.ok) throw new ApiError("deleteAllContractors failed", data);
  // console.log("deleteAllContractors Response", data);
  return data;
};

export const fetchContractorFilterOptions =
  async (): Promise<ContractorFilterOptions> => {
    const { response, data } = await fetchApi(API_ROUTE, `/filter/`, {
      method: "GET",
    });
    if (!response.ok)
      throw new ApiError("fetchContractorFilterOptions failed", data);
    // console.log("fetchContractorFilterOptions Response", data);
    return data;
  };

export const contractorsFetcher = async (
  searchRequest: ContractorSearchRequest
): Promise<SearchResponse<ContractorRead>> => {
  if (!searchRequest.query.text) searchRequest.query.text = "";
  const { response, data } = await fetchApi(API_ROUTE, `/search`, {
    method: "POST",
    body: searchRequest,
  });
  if (!response.ok) throw new ApiError("contractorsFetcher failed", data);
  // console.log("contractorsFetcher Response", data);
  return data;
};
