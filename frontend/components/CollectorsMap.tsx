import React from "react";
import GoogleMapReact from "google-map-react";
import { Coords } from "google-map-react";

const Marker = ({ lat, lng }: { lat: number; lng: number }) => (
  <div className="bg-green-500 text-white p-2 rounded-full border-2 border-blue-500" />
);

export default function CollectorsMap({ coords }: { coords: Coords[] }) {
  const defaultProps = {
    center: {
      lat: 47.081013,
      lng: 2.398782,
    },
    zoom: 5,
  };

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: "500px", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        {coords.map((coord, index) => (
          <Marker key={index} lat={coord.lat} lng={coord.lng} />
        ))}
      </GoogleMapReact>
    </div>
  );
}
