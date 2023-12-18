import { BuildingElementCard } from "@/components/BuildingElementCard";
import ExcelReader from "@/components/ui/ExcelReader";
import { Button } from "@/components/ui/button";
import { uploadBuildingElements } from "@/lib/api/items/building-elements";
import { BuildingElementCreate } from "@/types/api/items/building-element";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

export default function BuildingElementUploadPage() {
  const { data: session } = useSession();
  const [buildingElementsToUpload, setBuildingElementsToUpload] = useState<
    BuildingElementCreate[]
  >([]);

  const handleFileUpload = (lat: number, lng: number, data: any[][]) => {
    // Clear existing data
    // setBuildingElementReusables([]);

    const upload_uuid = uuidv4();

    let currCategory;
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (row.length == 2 && row[0] == null && row[1] != null) {
        currCategory = row[1];
        continue;
      }
      if (row.length == 0 || currCategory == null) {
        // skip empty rows and the first rows without a category (headers)
        continue;
      }

      console.log(row);

      // Extracting dimensions if they exist in the form of 'H = value ; l = value' etc.
      const dimensions = row[9]?.match(
        /H\s*=\s*([\d.]+)\s*;\s*l\s*=\s*([\d.]+)\s*;\s*diamètre\s*=\s*([\d.]+)|H\s*=\s*([\d.]+)/i
      );
      const buildingElementsToUpload: BuildingElementCreate = {
        quantity: row[6],
        total_mass_kg: row[7],
        total_volume_m3: row[8],
        // If dimensions exist, assign them to their corresponding properties
        H: dimensions ? parseFloat(dimensions[1] || dimensions[4]) : undefined,
        l: dimensions ? parseFloat(dimensions[2]) : undefined,
        diameter: dimensions ? parseFloat(dimensions[3]) : undefined,
        localization: row[10],
        condition: row[13],
        reuse_potential: row[14],
        drop_off_procedures: row[15],
        storage_method: row[16],
        lat: lat,
        lng: lng,
        upload_uuid: upload_uuid,

        category_type: currCategory,
        unit_type: row[2],
        constitution_types: row[11] ? row[11].split(" ; ") : [],
        material_types: row[12] ? row[12].split(" ; ") : [],
        item: {
          title: row[1],
          // must match with /shared/types.py ItemCategoryEnum
          category_type_id: 1,
        },
      };

      // Logging and updating state
      console.log(buildingElementsToUpload);
      setBuildingElementsToUpload((prev) => [
        ...prev,
        buildingElementsToUpload,
      ]);
    }
  };

  const upload = async () => {
    if (!session) {
      toast.error("You must be logged in to upload building elements");
      return;
    }
    try {
      const res = await uploadBuildingElements(
        buildingElementsToUpload,
        session
      );
      console.log(res);
      toast.success("Successfully uploaded building elements");
      setBuildingElementsToUpload([]);
    } catch (err) {
      console.log(err);
      toast.error("Failed to upload building elements");
    }
  };

  return (
    <>
      <h2>Upload Building Elements from Excel</h2>
      <ExcelReader
        onFileUploaded={handleFileUpload}
        supportedWorksheetNames={[
          // "STRUCTURE",
          // "SECOND OEUVRE",
          // "RESEAUX",
          // "AMENAGEMENT EXT",
          "DECHETS RESIDUELS",
          // "DEEE",
          // "DEA",
        ]}
      />
      {buildingElementsToUpload.map((buildingElementToUpload, index) => (
        <div key={index} className="mt-8">
          <BuildingElementCard {...buildingElementToUpload} />
        </div>
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
    </>
  );
}
