import { BuildingElementCard } from "@/components/cards/BuildingElementCard";
import ExcelReader from "@/components/ui/ExcelReader";
import { Button } from "@/components/ui/button";
import { uploadBuildingElements } from "@/lib/api/building-elements";
import { roundNumber } from "@/lib/utils";
import { BuildingElementCreate } from "@/types/api/items/building-element";

import { useState } from "react";
import toast from "react-hot-toast";

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
    const first_row = data[0];
    const second_row = data[1];
    const columnIndices = {
      reference: first_row.indexOf("Référence"),
      title: first_row.indexOf("DESIGNATION"),
      unit: first_row.indexOf("Unité"),

      total: second_row.indexOf("total"),
      total_mass_kg: second_row.indexOf("Masse totale estimée in kg"),
      total_volume_m3: second_row.indexOf("volume total en m3"),
      material: second_row.indexOf("matériaux"),
      health_status: second_row.indexOf("état sanitaire des matériaux"),
      reuse_potential: second_row.indexOf(
        "potentiel de réemploi/ réutilisation"
      ),
      waste_code: second_row.indexOf("code déchet"),
      recycling_potential: second_row.indexOf("potentiel de recyclage"),
      has_energy_recovery: second_row.indexOf("valorisation énergie"),
      has_elimination: second_row.indexOf("élimination"),
    };

    let currCategoryName;
    for (let i = 2; i < data.length; i++) {
      const row = data[i];
      if (row.length < 2) continue;
      if (row.length == 2) {
        currCategoryName = row[1];
        continue;
      }
      if (!currCategoryName) continue;

      const buildingElement: BuildingElementCreate = {
        upload_uuid: "test",
        address: address,
        latitude: location[0],
        longitude: location[1],

        worksheet_type: sheetName,
        category: currCategoryName,

        reference: row[columnIndices.reference],
        title: row[columnIndices.title],
        unit_type: row[columnIndices.unit],

        total: roundNumber(row[columnIndices.total], 10000),
        total_mass_kg: roundNumber(row[columnIndices.total_mass_kg], 100),
        total_volume_m3: roundNumber(row[columnIndices.total_volume_m3], 100),
        material_type: row[columnIndices.material],
        health_status_type: row[columnIndices.health_status],
        reuse_potential_type: row[columnIndices.reuse_potential],
        waste_code_type: row[columnIndices.waste_code],
        recycling_potential_type: row[columnIndices.recycling_potential],
        has_energy_recovery: row[columnIndices.has_energy_recovery],
        has_elimination: row[columnIndices.has_elimination],
      };

      postprocess(buildingElement);

      if (!buildingElement.unit_type) {
        console.log("no unit type");
        console.log(buildingElement);
        continue;
      }

      setBuildingElementsToUpload((prev) => [...prev, buildingElement]);
    }
  };

  const postprocess = (buildingElement: BuildingElementCreate) => {
    Object.keys(buildingElement).forEach((key) => {
      let value = buildingElement[key as keyof BuildingElementCreate];
      if (typeof value === "string") {
        value = value.replace(/\u00A0/g, " ");
        value = value.replace("m2", "m²");
        value = value.replace("m3", "m³");
        value = value.trim();
        (buildingElement as any)[key] = value;
      }
    });
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
