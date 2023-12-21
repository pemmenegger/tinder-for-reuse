import {
  CollectorCreate,
  CollectorFilterOptions,
  CollectorRead,
  CollectorSearchRequest,
} from "@/types/api/collector";
import { ApiError, fetchApi } from "../utils";
import { SearchResponse } from "@/types/api/search";

const API_ROUTE = "/api/collectors";

export const createCollector = async (
  collector: CollectorCreate
): Promise<CollectorRead> => {
  const { response, data } = await fetchApi(API_ROUTE, `/`, {
    method: "POST",
    body: [collector],
  });
  if (!response.ok) throw new ApiError("createCollector failed", data);
  console.log("createCollector Response", data);
  return data;
};

export const updateCollector = async (
  collectorId: number,
  collector: CollectorCreate
): Promise<CollectorRead> => {
  const { response, data } = await fetchApi(API_ROUTE, `/${collectorId}`, {
    method: "PUT",
    body: collector,
  });
  if (!response.ok) throw new ApiError("updateCollector failed", data);
  console.log("updateCollector Response", data);
  return data;
};

export const deleteCollector = async (
  collectorId: number
): Promise<CollectorRead> => {
  const { response, data } = await fetchApi(API_ROUTE, `/${collectorId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new ApiError("deleteCollector failed", data);
  console.log("deleteCollector Response", data);
  return data;
};

export const fetchCollectorFilterOptions =
  async (): Promise<CollectorFilterOptions> => {
    const { response, data } = await fetchApi(API_ROUTE, `/filter/`, {
      method: "GET",
    });
    if (!response.ok)
      throw new ApiError("fetchCollectorFilterOptions failed", data);
    console.log("fetchCollectorFilterOptions Response", data);
    return data;
  };

export const collectorsFetcher = async (
  searchRequest: CollectorSearchRequest
): Promise<SearchResponse<CollectorRead>> => {
  const { response, data } = await fetchApi(API_ROUTE, `/search`, {
    method: "POST",
    body: searchRequest,
  });
  if (!response.ok) throw new ApiError("collectorsFetcher failed", data);
  console.log("collectorsFetcher Response", data);
  return data;
};
