import CollectorsMap from "@/components/CollectorsMap";
import { Coords } from "google-map-react";

export default function CollectorsPage() {
  const coords: Coords[] = [
    {
      lat: 48.38987,
      lng: -4.48718,
    },
    {
      lat: 45.764042,
      lng: 4.835659,
    },
    {
      lat: 43.296482,
      lng: 5.36978,
    },
  ];

  return (
    <>
      <h2>Collectors</h2>
      <CollectorsMap coords={coords} />
    </>
  );
}
