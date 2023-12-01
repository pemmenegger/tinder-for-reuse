import React, { useEffect, useRef } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import { CollectorRead } from "@/types/api/collector";
import {
  MarkerClusterer,
  SuperClusterAlgorithm,
} from "@googlemaps/markerclusterer";

const DEFAULT_CENTER = { lat: 47.081013, lng: 2.398782 };
const DEFAULT_ZOOM = 5;

const GoogleMapsWrapper = ({ children }: { children: React.ReactNode }) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

  if (!apiKey) {
    return <div>Cannot display the map: google maps api key missing</div>;
  }

  return <Wrapper apiKey={apiKey}>{children}</Wrapper>;
};

const addSingleMarkers = ({
  locations,
  map,
}: {
  locations: ReadonlyArray<google.maps.LatLngLiteral>;
  map: google.maps.Map | null | undefined;
}) =>
  locations.map(
    (position) =>
      new google.maps.Marker({
        position,
        map,
        icon: {
          url: "/icons/marker.svg",
          scaledSize: new google.maps.Size(22, 31),
        },
      })
  );

const addClusterMarkers = ({
  locations,
  map,
}: {
  locations: ReadonlyArray<google.maps.LatLngLiteral>;
  map: google.maps.Map | null | undefined;
}) => {
  const markers = addSingleMarkers({ locations, map });

  new MarkerClusterer({
    markers,
    map,
    algorithm: new SuperClusterAlgorithm({
      radius: 100,
    }),
    renderer: {
      render: (cluster, stats, map) => {
        const marker = new google.maps.Marker({
          position: cluster.position,
          map: map,
          label: {
            text: `${cluster.count}`,
            color: "white",
          },
          icon: {
            url: "/icons/cluster.svg",
            scaledSize: new google.maps.Size(50, 50),
          },
        });

        return marker;
      },
    },
  });
};

const GoogleMaps = ({
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
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      const map = new window.google.maps.Map(ref.current, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
      });

      const locations = collectors.map((collector) => ({
        lat: collector.lat,
        lng: collector.lng,
      }));

      addClusterMarkers({ locations, map });
    }
  }, [ref, collectors]);

  return (
    <div
      ref={ref}
      className={`${className} w-full h-[500px] rounded-lg overflow-hidden`}
    />
  );
};

const CollectorsMap = ({
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
}) => {
  return (
    <GoogleMapsWrapper>
      <GoogleMaps
        collectors={collectors}
        activeCollector={activeCollector}
        setActiveCollector={setActiveCollector}
        setVisibleCollectorIds={setVisibleCollectorIds}
        className={className}
      />
    </GoogleMapsWrapper>
  );
};

export default CollectorsMap;
