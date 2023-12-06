import {
  BuildingElementCreate,
  BuildingElementFilterOptions,
  BuildingElementMatchesResponse,
  BuildingElementSearchRequest,
  BuildingElementSearchResponse,
} from "@/types/api/items/building-element";
import { ApiError, fetchApi } from "../base";
import { Session } from "next-auth";

const API_ROUTE = "/api/items/building-elements";

export const uploadBuildingElements = async (
  buildingElements: BuildingElementCreate[],
  session: Session
) => {
  const { response, data } = await fetchApi(API_ROUTE, `/`, {
    method: "POST",
    body: buildingElements,
    session: session,
  });
  if (!response.ok)
    throw new ApiError("createBuildingElements fehlgeschlagen", data);
  console.log("createBuildingElements Response", data);
  return data;
};

export const fetchBuildingElementFilterOptions =
  async (): Promise<BuildingElementFilterOptions> => {
    const { response, data } = await fetchApi(API_ROUTE, `/filter/`, {
      method: "GET",
    });
    if (!response.ok)
      throw new ApiError("readBuildingElementFilterTypes fehlgeschlagen", data);
    // console.log("readBuildingElementFilterTypes Response", data);
    return data;
  };

export const fetchMyBuildingElements = async (session: Session) => {
  const { response, data } = await fetchApi(API_ROUTE, `/my`, {
    method: "GET",
    session: session,
  });
  if (!response.ok)
    throw new ApiError("getMyBuildingElements fehlgeschlagen", data);
  console.log("getMyBuildingElements Response", data);
  return data;
};

export const buildingElementsFetcher = async (
  searchRequest: BuildingElementSearchRequest
): Promise<BuildingElementSearchResponse> => {
  const { response, data } = await fetchApi(API_ROUTE, `/search/`, {
    method: "POST",
    body: searchRequest,
  });
  if (!response.ok)
    throw new ApiError("Fetching building elements failed", data);

  console.log("buildingElementsFetcher Response", data);
  return data;
};

export const buildingElementMatchesFetcher = async (
  searchRequest: BuildingElementSearchRequest
): Promise<BuildingElementMatchesResponse> => {
  const { response, data } = await fetchApi(API_ROUTE, `/matches/`, {
    method: "POST",
    body: searchRequest,
  });
  if (!response.ok)
    throw new ApiError("Fetching building element matches failed", data);

  console.log("buildingElementMatchesFetcher Response", data);
  return data;
};
