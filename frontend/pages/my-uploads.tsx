import { BuildingElementCard } from "@/components/BuildingElementCard";
import { fetchMyBuildingElements } from "@/lib/api/items/building-elements";
import { BuildingElementRead } from "@/types/api/items/building-element";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function MyUploadsPage() {
  const { data: session } = useSession();
  const [myBuildingElements, setMyBuildingElements] =
    useState<BuildingElementRead[]>();

  const fetch = async () => {
    if (!session) return;
    const myBuildingElements: BuildingElementRead[] =
      await fetchMyBuildingElements(session);
    setMyBuildingElements(myBuildingElements);
  };

  useEffect(() => {
    void fetch();
  }, [session]);

  return (
    <>
      <h2>My uploaded BuildingElements</h2>
      {myBuildingElements?.map((buildingElement) => (
        <BuildingElementCard key={buildingElement.id} {...buildingElement} />
      ))}
    </>
  );
}
