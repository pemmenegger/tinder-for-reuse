import {
  BuildingElementFilterOptions,
  BuildingElementSearchRequest,
  BuildingElementUploadCreate,
  BuildingElementUploadRead,
} from "@/types/api/building-element";
import { ApiError, fetchApi } from "../utils";
import { SearchResponse } from "@/types/api/search";

const API_ROUTE = "/api/building-elements";

export const createBuildingElementUpload = async (
  buildingElementUpload: BuildingElementUploadCreate
) => {
  const { response, data } = await fetchApi(API_ROUTE, `/`, {
    method: "POST",
    body: buildingElementUpload,
  });
  if (!response.ok)
    throw new ApiError("createBuildingElementUpload failed", data);
  // console.log("createBuildingElementUpload response", data);
  return data;
};

export const deleteAllBuildingElements = async () => {
  const { response, data } = await fetchApi(API_ROUTE, `/`, {
    method: "DELETE",
  });
  if (!response.ok)
    throw new ApiError("deleteAllBuildingElements failed", data);
  // console.log("deleteAllBuildingElements response", data);
  return data;
};

export const fetchBuildingElementFilterOptions =
  async (): Promise<BuildingElementFilterOptions> => {
    const { response, data } = await fetchApi(API_ROUTE, `/filter/`, {
      method: "GET",
    });
    if (!response.ok)
      throw new ApiError("readBuildingElementFilterTypes failed", data);
    // console.log("readBuildingElementFilterTypes Response", data);
    return data;
  };

export const buildingElementUploadsFetcher = async (
  searchRequest: BuildingElementSearchRequest
): Promise<SearchResponse<BuildingElementUploadRead>> => {
  if (!searchRequest.query.text) searchRequest.query.text = "";
  const { response, data } = await fetchApi(API_ROUTE, `/search/`, {
    method: "POST",
    body: searchRequest,
  });
  if (!response.ok)
    throw new ApiError("Fetching building elements failed", data);
  // console.log("buildingElementsFetcher Response", data);
  return data;
};
