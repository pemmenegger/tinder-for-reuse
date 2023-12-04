import React, { useEffect, useRef, useState } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import {
  MarkerClusterer,
  SuperClusterAlgorithm,
} from "@googlemaps/markerclusterer";

export type MapMarker = {
  id: number;
  lat: number;
  lng: number;
  iconUrl: string;
  iconScaledSize: {
    width: number;
    height: number;
  };
};

const GoogleMapsWrapper = ({ children }: { children: React.ReactNode }) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

  if (!apiKey) {
    return <div>Cannot display the map: google maps api key missing</div>;
  }

  return <Wrapper apiKey={apiKey}>{children}</Wrapper>;
};

const addMarkerClusterer = ({
  mapMarkers,
  map,
  setActiveMapMarkerId,
}: {
  mapMarkers: MapMarker[];
  map: google.maps.Map | null | undefined;
  setActiveMapMarkerId: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const markers = mapMarkers.map((mapMarker, index) => {
    const marker = new google.maps.Marker({
      position: {
        lat: mapMarker.lat,
        lng: mapMarker.lng,
      },
      map,
      icon: {
        url: mapMarker.iconUrl,
        scaledSize: new google.maps.Size(
          mapMarker.iconScaledSize.width,
          mapMarker.iconScaledSize.height
        ),
      },
    });

    marker.addListener("click", () => {
      setActiveMapMarkerId(mapMarkers[index].id);
      // console.log("clicked on marker", markers[index]);
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
  mapMarkers,
  activeMapMarkerId,
  setVisibleMapMarkerIds,
  setActiveMapMarkerId,
  className,
}: {
  mapMarkers: MapMarker[];
  activeMapMarkerId: number | null;
  setVisibleMapMarkerIds: React.Dispatch<React.SetStateAction<number[]>>;
  setActiveMapMarkerId: React.Dispatch<React.SetStateAction<number | null>>;
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

    const visibleMapMarkerIds = mapMarkers
      .filter((mapMarker) =>
        bounds?.contains(
          new window.google.maps.LatLng(mapMarker.lat, mapMarker.lng)
        )
      )
      .map((mapMarker) => mapMarker.id);

    setVisibleMapMarkerIds(visibleMapMarkerIds);
  }, [mapMarkers, bounds]);

  useEffect(() => {
    if (!map) return;

    if (activeMapMarkerId) {
      mapMarkers = mapMarkers.filter(
        (mapMarker) => mapMarker.id === activeMapMarkerId
      );
    }

    const markerClusterer = addMarkerClusterer({
      mapMarkers,
      map,
      setActiveMapMarkerId,
    });

    return () => {
      markerClusterer.clearMarkers();
    };
  }, [activeMapMarkerId, mapMarkers, map]);

  return (
    <div
      ref={ref}
      className={`${className} w-full h-[500px] rounded-lg overflow-hidden`}
    />
  );
};

export default function SearchWithMapResultsWrapper({
  isLoading,
  mapMarkers,
  ResultsComponent,
  LoadingSkeletonComponent,
}: {
  isLoading: boolean;
  mapMarkers: MapMarker[];
  ResultsComponent: React.ComponentType<any>;
  LoadingSkeletonComponent: React.ComponentType<any>;
}) {
  const [visibleMapMarkerIds, setVisibleMapMarkerIds] = useState<number[]>([]);
  const [activeMapMarkerId, setActiveMapMarkerId] = useState<number | null>(
    null
  );
  const IGNORE_DEACTIVATION_CLASS = "ignore-deactivation";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // only deactivate if the click is outside the active collector
      if (!target.closest(`.${IGNORE_DEACTIVATION_CLASS}`)) {
        setActiveMapMarkerId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setVisibleMapMarkerIds(mapMarkers.map((mapMarker) => mapMarker.id));
  }, [mapMarkers]);

  return (
    <>
      <GoogleMapsWrapper>
        <GoogleMaps
          mapMarkers={mapMarkers}
          activeMapMarkerId={activeMapMarkerId}
          setVisibleMapMarkerIds={setVisibleMapMarkerIds}
          setActiveMapMarkerId={setActiveMapMarkerId}
          className={IGNORE_DEACTIVATION_CLASS}
        />
      </GoogleMapsWrapper>
      {mapMarkers
        .filter((mapMarker) =>
          activeMapMarkerId
            ? activeMapMarkerId === mapMarker.id
            : visibleMapMarkerIds.includes(mapMarker.id)
        )
        .map((visibleCollector, index) => (
          <a
            onClick={() => setActiveMapMarkerId(visibleCollector.id)}
            key={index}
            className={`cursor-pointer ${IGNORE_DEACTIVATION_CLASS}`}
          >
            <ResultsComponent
              {...visibleCollector}
              isActive={activeMapMarkerId === visibleCollector.id}
            />
          </a>
        ))}
      {isLoading && (
        <>
          <LoadingSkeletonComponent />
          <LoadingSkeletonComponent />
          <LoadingSkeletonComponent />
        </>
      )}
    </>
  );
}
