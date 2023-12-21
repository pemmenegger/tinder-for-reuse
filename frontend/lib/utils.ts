import { CollectorRead } from "@/types/api/collector";
import { ContractorRead } from "@/types/api/contractor";
import { MapMarker } from "@/types/item";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { BuildingElementUploadRead } from "@/types/api/items/building-element";
import { CollectorCard } from "@/components/cards/CollectorCard";
import { ContractorCard } from "@/components/cards/ContractorCard";
import { BuildingElementUploadCard } from "@/components/cards/BuildingElementUploadCard";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const roundNumber = (value: string, precision: number) => {
  const number = Number(value);
  return Math.round(number * precision) / precision;
};

export const generateCollectorMapMarkers = (
  collectors: CollectorRead[]
): MapMarker[] => {
  return collectors.map((collector) => ({
    id: collector.id,
    latitude: collector.latitude,
    longitude: collector.longitude,
    iconUrl: "/icons/collectors/marker.svg",
    iconScaledSize: {
      width: 22,
      height: 31,
    },
    results: [collector],
    ResultCard: CollectorCard,
  }));
};

export const generateContractorMapMarkers = (
  contractors: ContractorRead[]
): MapMarker[] => {
  return contractors.map((contractor) => ({
    id: contractor.id,
    latitude: contractor.latitude,
    longitude: contractor.longitude,
    iconUrl: "/icons/contractors/marker.svg",
    iconScaledSize: {
      width: 22,
      height: 31,
    },
    results: [contractor],
    ResultCard: ContractorCard,
  }));
};

export const generateBuildingElementUploadMapMarkers = (
  buildingElementUploads: BuildingElementUploadRead[]
): MapMarker[] => {
  return buildingElementUploads.map((buildingElementUpload) => ({
    id: buildingElementUpload.id,
    latitude: buildingElementUpload.latitude,
    longitude: buildingElementUpload.longitude,
    iconUrl: "/icons/building-elements/marker.svg",
    iconScaledSize: {
      width: 22,
      height: 31,
    },
    results: [buildingElementUpload],
    ResultCard: BuildingElementUploadCard,
  }));
};

export const fetchApi = async (
  route: string,
  endpoint: string,
  options: { method: string; body?: any; headers?: any }
): Promise<any> => {
  const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${route}${endpoint}`;

  const { method, body } = options;

  let { headers } = options;
  if (!headers) {
    headers = {};
  }

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  const init: RequestInit = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };

  try {
    const response = await fetch(fullUrl, init);

    if (!response.ok) {
      throw new Error(
        `Error fetching api: ${response.status} ${
          response.statusText
        } - ${await response.text()}`
      );
    }

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.indexOf("application/json") !== -1) {
      const data = await response.json();
      return { response, data };
    } else {
      const text = await response.text();
      return { response, text };
    }
  } catch (error) {
    console.error(`Error in fetcher: ${error}`);
    throw error;
  }
};

export class ApiError extends Error {
  private readonly status: number;

  constructor(
    message: string,
    errorBody: { message: string; name: string; status: number }
  ) {
    super(message);
    this.name = errorBody.name;
    this.status = errorBody.status;
    this.cause = errorBody.message;
  }
}
