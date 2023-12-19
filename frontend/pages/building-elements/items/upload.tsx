import { BuildingElementCard } from "@/components/cards/BuildingElementCard";
import ExcelReader from "@/components/ui/ExcelReader";
import { Button } from "@/components/ui/button";
import { uploadBuildingElements } from "@/lib/api/items/building-elements";
import { BuildingElementCreate } from "@/types/api/items/building-element";

import { useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

export default function BuildingElementUploadPage() {
  const [buildingElementsToUpload, setBuildingElementsToUpload] = useState<
    BuildingElementCreate[]
  >([]);

  const handleFileUpload = (
    data: any[][],
    sheetName: string,
    address: string,
    location: [number, number]
  ) => {
    const upload_uuid = uuidv4();

    const headers = data[1];
    const columnIndices = {
      total_mass: headers.indexOf("poids total en tonne"),
      total_volume: headers.indexOf("volume total en m3"),
      material: headers.indexOf("matériaux"),
      condition_sanitary: headers.indexOf("état sanitaire des matériaux"),
      reuse_potential: headers.indexOf("potentiel de réemploi/ réutilisation"),
      waste_code: headers.indexOf("code déchet"),
      recycling_potential: headers.indexOf("potentiel de recyclage"),
      energy_recovery: headers.indexOf("valorisation énergie"),
      disposal: headers.indexOf("élimination"),
    };

    let currCategory;
    for (let i = 2; i < data.length; i++) {
      const row = data[i];
      if (row.length < 2) continue;
      if (row.length == 2) {
        currCategory = row[1];
        continue;
      }
      if (!currCategory) continue;

      const newElement: BuildingElementCreate = {
        total_mass: row[columnIndices.total_mass],
        total_volume: row[columnIndices.total_volume],
        material: row[columnIndices.material],
        condition_sanitary: row[columnIndices.condition_sanitary],
        reuse_potential: row[columnIndices.reuse_potential],
        waste_code: row[columnIndices.waste_code],
        recycling_potential: row[columnIndices.recycling_potential],
        energy_recovery: row[columnIndices.energy_recovery],
        disposal: row[columnIndices.disposal],
        category_type: currCategory,
        worksheet: sheetName,
        item: {
          title: row[1],
          category_type_id: 1, // This might need to be dynamically determined
        },
        address: address,
        lat: location[0],
        lng: location[1],
        upload_uuid: upload_uuid,
      };

      setBuildingElementsToUpload((prev) => [...prev, newElement]);
    }
  };

  const upload = async () => {
    if (buildingElementsToUpload.length === 0) {
      toast.error("No building elements to upload");
      return;
    }

    try {
      await uploadBuildingElements(buildingElementsToUpload);
      toast.success("Successfully uploaded building elements");
      setBuildingElementsToUpload([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload building elements");
    }
  };

  return (
    <>
      <h2>Upload your deconstructed Materials</h2>
      <ExcelReader
        onFileUploaded={handleFileUpload}
        supportedWorksheetNames={[
          "STRUCTURE",
          "SECOND OEUVRE",
          "RESEAUX",
          "AMENAGEMENT EXT",
          "DECHETS RESIDUELS",
          "DEEE",
          "DEA",
        ]}
      />
      {buildingElementsToUpload.map((buildingElementToUpload, index) => (
        <BuildingElementCard
          data={buildingElementToUpload}
          key={index}
          className="mt-8"
        />
      ))}
      <Button
        className="mt-8"
        variant={buildingElementsToUpload.length === 0 ? "disabled" : "primary"}
        size="sm"
        disabled={buildingElementsToUpload.length === 0}
        onClick={async () => await upload()}
      >
        Upload
      </Button>
      <p onClick={() => console.log(buildingElementsToUpload)}>
        print elements
      </p>
    </>
  );
}
