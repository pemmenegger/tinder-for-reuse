import React, { useEffect, useRef, useState } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import { CollectorRead } from "@/types/api/collector";
import {
  MarkerClusterer,
  SuperClusterAlgorithm,
} from "@googlemaps/markerclusterer";

const GoogleMapsWrapper = ({ children }: { children: React.ReactNode }) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

  if (!apiKey) {
    return <div>Cannot display the map: google maps api key missing</div>;
  }

  return <Wrapper apiKey={apiKey}>{children}</Wrapper>;
};

const addMarkerClusterer = ({
  collectors,
  map,
  setActiveCollectorId,
}: {
  collectors: CollectorRead[];
  map: google.maps.Map | null | undefined;
  setActiveCollectorId: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const markers = collectors.map((collector, index) => {
    const marker = new google.maps.Marker({
      position: {
        lat: collector.lat,
        lng: collector.lng,
      },
      map,
      icon: {
        url: "/icons/marker.svg",
        scaledSize: new google.maps.Size(22, 31),
      },
    });

    marker.addListener("click", () => {
      setActiveCollectorId(collectors[index].id);
      console.log("clicked on marker", collectors[index]);
    });

    return marker;
  });

  return new MarkerClusterer({
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
  activeCollectorId,
  setVisibleCollectorIds,
  setActiveCollectorId,
  className,
}: {
  collectors: CollectorRead[];
  activeCollectorId: number | null;
  setVisibleCollectorIds: React.Dispatch<React.SetStateAction<number[]>>;
  setActiveCollectorId: React.Dispatch<React.SetStateAction<number | null>>;
  className?: string;
}) => {
  const [bounds, setBounds] = useState<google.maps.LatLngBounds | undefined>();
  const [map, setMap] = useState<google.maps.Map>();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current && !map) {
      const initializedMap = new window.google.maps.Map(ref.current, {
        center: { lat: 47.081013, lng: 2.398782 },
        zoom: 5,
      });
      setMap(initializedMap);
    }
  }, [ref, map]);

  useEffect(() => {
    if (!map) return;

    const updateBounds = () => {
      setBounds(map.getBounds());
    };

    map.addListener("idle", updateBounds);

    return () => {
      window.google.maps.event.clearInstanceListeners(map);
    };
  }, [map]);

  useEffect(() => {
    if (!bounds) return;

    const visibleCollectorIds = collectors
      .filter((collector) =>
        bounds?.contains(
          new window.google.maps.LatLng(collector.lat, collector.lng)
        )
      )
      .map((collector) => collector.id);

    setVisibleCollectorIds(visibleCollectorIds);
  }, [collectors, bounds]);

  useEffect(() => {
    if (!map) return;

    if (activeCollectorId) {
      collectors = collectors.filter(
        (collector) => collector.id === activeCollectorId
      );
    }

    const markerClusterer = addMarkerClusterer({
      collectors,
      map,
      setActiveCollectorId,
    });

    return () => {
      markerClusterer.clearMarkers();
    };
  }, [activeCollectorId, collectors, map]);

  return (
    <div
      ref={ref}
      className={`${className} w-full h-[500px] rounded-lg overflow-hidden`}
    />
  );
};

const CollectorsMap = ({
  collectors,
  activeCollectorId,
  setVisibleCollectorIds,
  setActiveCollectorId,
  className,
}: {
  collectors: CollectorRead[];
  activeCollectorId: number | null;
  setActiveCollectorId: React.Dispatch<React.SetStateAction<number | null>>;
  setVisibleCollectorIds: React.Dispatch<React.SetStateAction<number[]>>;
  className?: string;
}) => {
  return (
    <GoogleMapsWrapper>
      <GoogleMaps
        collectors={collectors}
        activeCollectorId={activeCollectorId}
        setVisibleCollectorIds={setVisibleCollectorIds}
        setActiveCollectorId={setActiveCollectorId}
        className={className}
      />
    </GoogleMapsWrapper>
  );
};

export default CollectorsMap;
