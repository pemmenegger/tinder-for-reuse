import React, { useEffect, useRef, useState } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import {
  MarkerClusterer,
  SuperClusterAlgorithm,
} from "@googlemaps/markerclusterer";
import { MapMarker } from "@/types/item";
import { BuildingElementCardSkeleton } from "../BuildingElementCard";

const GoogleMapsWrapper = ({ children }: { children: React.ReactNode }) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

  if (!apiKey) {
    return <div>Cannot display the map: google maps api key missing</div>;
  }

  return <Wrapper apiKey={apiKey}>{children}</Wrapper>;
};

const addMarkers = ({
  mapMarkers,
  map,
  setActiveMapMarkerId,
}: {
  mapMarkers: MapMarker[];
  map: google.maps.Map | null | undefined;
  setActiveMapMarkerId: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  return mapMarkers.map((mapMarker) => {
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
      const markerId = mapMarker.id;
      setActiveMapMarkerId(markerId);
    });

    return marker;
  });
};

const addMarkerClusterer = ({
  markers,
  clusterIconUrl,
  map,
}: {
  markers: google.maps.Marker[];
  clusterIconUrl: string;
  map: google.maps.Map | null | undefined;
}) => {
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
            url: clusterIconUrl,
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
  clusterIconUrl,
  activeMapMarkerId,
  setVisibleMapMarkerIds,
  setActiveMapMarkerId,
}: {
  mapMarkers: MapMarker[];
  clusterIconUrl?: string;
  activeMapMarkerId: number | null;
  setVisibleMapMarkerIds: React.Dispatch<React.SetStateAction<number[]>>;
  setActiveMapMarkerId: React.Dispatch<React.SetStateAction<number | null>>;
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

    const markers = addMarkers({
      mapMarkers,
      map,
      setActiveMapMarkerId,
    });

    if (clusterIconUrl) {
      const markerClusterer = addMarkerClusterer({
        markers,
        clusterIconUrl,
        map,
      });

      return () => {
        markerClusterer.clearMarkers();
      };
    }

    return () => {
      markers.forEach((marker) => marker.setMap(null));
    };
  }, [activeMapMarkerId, mapMarkers, map]);

  return (
    <div ref={ref} className="w-full h-[500px] rounded-lg overflow-hidden" />
  );
};

export default function SearchWithMapResultsWrapper({
  isLoading,
  mapMarkers,
  clusterIconUrl,
}: {
  isLoading: boolean;
  mapMarkers: MapMarker[];
  clusterIconUrl?: string;
}) {
  const [visibleMapMarkerIds, setVisibleMapMarkerIds] = useState<number[]>([]);
  const [activeMapMarkerId, setActiveMapMarkerId] = useState<number | null>(
    null
  );
  const IGNORE_DEACTIVATION_CLASS = "ignore-deactivation";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      // google markers fix
      // TODO improve
      if (
        target.tagName === "IMG" &&
        target.getAttribute("src") ===
          "https://maps.gstatic.com/mapfiles/transparent.png"
      ) {
        return;
      }

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

  const visibleMapMarkers = mapMarkers.filter((mapMarker) =>
    activeMapMarkerId
      ? activeMapMarkerId === mapMarker.id
      : visibleMapMarkerIds.includes(mapMarker.id)
  );

  return (
    <>
      <div className={IGNORE_DEACTIVATION_CLASS}>
        <GoogleMapsWrapper>
          <GoogleMaps
            mapMarkers={mapMarkers}
            clusterIconUrl={clusterIconUrl}
            activeMapMarkerId={activeMapMarkerId}
            setVisibleMapMarkerIds={setVisibleMapMarkerIds}
            setActiveMapMarkerId={setActiveMapMarkerId}
          />
        </GoogleMapsWrapper>
      </div>
      {visibleMapMarkers.map((mapMarker) =>
        mapMarker.results.map((result, index) => (
          <a
            onClick={() => setActiveMapMarkerId(mapMarker.id)}
            key={`${mapMarker.id}.${index}`}
            className={`cursor-pointer ${IGNORE_DEACTIVATION_CLASS}`}
          >
            <mapMarker.ResultComponent
              {...result}
              isActive={activeMapMarkerId === mapMarker.id}
            />
          </a>
        ))
      )}
      {isLoading && (
        <>
          <BuildingElementCardSkeleton />
          <BuildingElementCardSkeleton />
          <BuildingElementCardSkeleton />
        </>
      )}
    </>
  );
}
