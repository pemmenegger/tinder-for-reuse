import {
  CollectorFilterOptions,
  CollectorRead,
  CollectorSearchRequest,
  CollectorSearchResponse,
} from "@/types/api/collector";
import { ApiError, fetchApi } from "./base";

const API_ROUTE = "/api/collectors";

export const fetchCollectors = async (): Promise<CollectorRead[]> => {
  const { response, data } = await fetchApi(API_ROUTE, `/`, {
    method: "GET",
  });
  if (!response.ok) throw new ApiError("fetchCollectors fehlgeschlagen", data);
  // console.log("fetchCollectors Response", data);
  return data;
};

export const fetchCollectorFilterOptions =
  async (): Promise<CollectorFilterOptions> => {
    const { response, data } = await fetchApi(API_ROUTE, `/filter/`, {
      method: "GET",
    });
    if (!response.ok)
      throw new ApiError("fetchCollectorFilterOptions fehlgeschlagen", data);
    console.log("fetchCollectorFilterOptions Response", data);
    return data;
  };

export const collectorsFetcher = async (
  pageIndex: number,
  searchRequest: CollectorSearchRequest
): Promise<CollectorSearchResponse> => {
  const { response, data } = await fetchApi(API_ROUTE, `/search`, {
    method: "POST",
    body: searchRequest,
  });
  if (!response.ok) throw new ApiError("Fetching collectors failed", data);
  console.log("CollectorsFetcher Response", data);
  return data;
};
