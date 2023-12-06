import { BuildingElementCard } from "@/components/BuildingElementCard";
import { CollectorCard } from "@/components/CollectorCard";
import { CollectorRead } from "@/types/api/collector";
import { BuildingElementRead } from "@/types/api/items/building-element";
import { MapMarker } from "@/types/item";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fromCollectorsToCollectorMapMarkers = (
  collectors: CollectorRead[]
): MapMarker[] => {
  return collectors.map((collector) => ({
    id: collector.id,
    lat: collector.lat,
    lng: collector.lng,
    iconUrl: "/icons/collectors/marker.svg",
    iconScaledSize: {
      width: 22,
      height: 31,
    },
    results: [collector],
    ResultComponent: CollectorCard,
  }));
};

export const fromBuildingElementsToBuildingElementsMapMarkers = (
  buildingElements: BuildingElementRead[]
): MapMarker[] => {
  const buildingElementsByUploadUuid = buildingElements.reduce(
    (accumulator, currentValue) => {
      if (!accumulator[currentValue.upload_uuid]) {
        accumulator[currentValue.upload_uuid] = [];
      }

      accumulator[currentValue.upload_uuid].push(currentValue);

      return accumulator;
    },
    {} as Record<string, BuildingElementRead[]>
  );

  return Object.values(buildingElementsByUploadUuid).map(
    (buildingElements) => ({
      id: buildingElements[0].id,
      lat: buildingElements[0].lat,
      lng: buildingElements[0].lng,
      iconUrl: "/icons/building-elements/marker.svg",
      iconScaledSize: {
        width: 22,
        height: 31,
      },
      results: buildingElements,
      ResultComponent: BuildingElementCard,
    })
  );
};
