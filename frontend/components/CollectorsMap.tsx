import React, { useEffect, useMemo } from "react";
import GoogleMapReact, { Bounds, Coords } from "google-map-react";
import Image from "next/image";
import { CollectorRead } from "@/types/api/collector";
const marker = require("../public/icons/marker.svg") as string;

const Marker = ({
  lat,
  lng,
  onClick,
}: {
  lat: number;
  lng: number;
  onClick: () => void;
}) => (
  <div onClick={onClick} className="absolute bottom-0 left-0 -translate-x-1/2">
    <div className="h-6 w-6 cursor-pointer">
      <Image src={marker} alt="Marker" fill={true} />
    </div>
  </div>
);

const filterCollectorsById = (
  collectors: CollectorRead[],
  activeCollector: CollectorRead
) => collectors.filter((collector) => collector.id === activeCollector.id);

const getVisibleCollectors = (collectors: CollectorRead[], bounds: Bounds) =>
  collectors.filter(
    (collector) =>
      collector.lat >= bounds.sw.lat &&
      collector.lat <= bounds.ne.lat &&
      collector.lng >= bounds.sw.lng &&
      collector.lng <= bounds.ne.lng
  );

export default function CollectorsMap({
  collectors,
  activeCollector,
  setActiveCollector,
  setVisibleCollectorIds,
  className,
}: {
  collectors: CollectorRead[];
  activeCollector: CollectorRead | null;
  setActiveCollector: React.Dispatch<
    React.SetStateAction<CollectorRead | null>
  >;
  setVisibleCollectorIds: React.Dispatch<React.SetStateAction<number[]>>;
  className?: string;
}) {
  const defaultProps = {
    center: {
      lat: 47.081013,
      lng: 2.398782,
    },
    zoom: 5,
  };
  const [mapCenter, setMapCenter] = React.useState<Coords>(defaultProps.center);
  const [bounds, setBounds] = React.useState<Bounds | null>(null);
  const [zoom, setZoom] = React.useState<number>(defaultProps.zoom);

  const filteredCollectors = useMemo(() => {
    console.log("new filteredCollectors");
    return activeCollector
      ? filterCollectorsById(collectors, activeCollector)
      : collectors;
  }, [collectors, activeCollector]);

  const handleMapChange = ({
    zoom,
    bounds,
  }: {
    zoom: number;
    bounds: Bounds;
  }) => {
    setBounds(bounds);
    setZoom(zoom);
  };

  useEffect(() => {
    const visibleCollectors = bounds
      ? getVisibleCollectors(collectors, bounds)
      : collectors;
    setVisibleCollectorIds(visibleCollectors.map((collector) => collector.id));
  }, [bounds, zoom, collectors]);

  return (
    <div className={`${className} w-full h-[500px] rounded-lg overflow-hidden`}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        }}
        center={mapCenter}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        onChange={handleMapChange}
      >
        {filteredCollectors.map((collector) => (
          <Marker
            key={collector.id}
            lat={collector.lat}
            lng={collector.lng}
            onClick={() => {
              setActiveCollector(collector);
              setMapCenter({ lat: collector.lat, lng: collector.lng });
            }}
          />
        ))}
      </GoogleMapReact>
    </div>
  );
}
