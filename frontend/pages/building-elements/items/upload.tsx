import { BuildingElementCard } from "@/components/cards/BuildingElementCard";
import ExcelReader, { FileData } from "@/components/ui/ExcelReader";
import { Button } from "@/components/ui/button";
import {
  createBuildingElementUpload,
  fetchBuildingElementFilterOptions,
} from "@/lib/api/building-elements";
import { roundNumber } from "@/lib/utils";
import {
  BuildingElementCreate,
  BuildingElementUploadCreate,
} from "@/types/api/items/building-element";
import { UnifiedTypeRead } from "@/types/api/type";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

export default function BuildingElementUploadPage() {
  const [buildingElementUploadToUpload, setBuildingElementsToUpload] =
    useState<BuildingElementUploadCreate>();

  const { data: filterOptions, error } = useSWR(
    "/api/building-elements/filter/",
    fetchBuildingElementFilterOptions
  );

  const handleFileUpload = (fileData: FileData) => {
    setBuildingElementsToUpload(undefined);

    const buildingElementUpload: BuildingElementUploadCreate = {
      address: fileData.address,
      latitude: fileData.latitude,
      longitude: fileData.longitude,
      building_elements: [],
    };

    const findColumnIndex = (sheetName: string, row: any[], target: string) => {
      const index = row.findIndex((column) => column?.includes(target));
      if (index === -1) {
        console.warn(
          `Could not find column <${target}> in sheet <${sheetName}> with row <${row}>`
        );
      }
      return index;
    };

    for (const sheet of fileData.content) {
      const { sheetName, data } = sheet;
      const first_row = data[0];
      const second_row = data[1];

      const columnIndices = {
        reference: findColumnIndex(sheetName, first_row, "Référence"),
        title: findColumnIndex(sheetName, first_row, "DESIGNATION"),
        unit: findColumnIndex(sheetName, first_row, "Unité"),

        total: findColumnIndex(sheetName, second_row, "total"),
        total_mass_kg: findColumnIndex(
          sheetName,
          second_row,
          "Masse totale estimée in kg"
        ),
        total_volume_m3: findColumnIndex(
          sheetName,
          second_row,
          "volume total en m3"
        ),
        material: findColumnIndex(sheetName, second_row, "matériaux"),
        health_status: findColumnIndex(
          sheetName,
          second_row,
          "état sanitaire des matériaux"
        ),
        reuse_potential: findColumnIndex(
          sheetName,
          second_row,
          "potentiel de réemploi/ réutilisation"
        ),
        waste_code: findColumnIndex(sheetName, second_row, "code déchet"),
        recycling_potential: findColumnIndex(
          sheetName,
          second_row,
          "potentiel de recyclage"
        ),
        has_energy_recovery: findColumnIndex(
          sheetName,
          second_row,
          "valorisation énergie"
        ),
        has_elimination: findColumnIndex(sheetName, second_row, "élimination"),
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

        const isTypeValid = (
          typeList: UnifiedTypeRead[],
          value?: string,
          columnName?: string,
          title?: string
        ) => {
          if (!value) return true;
          const isValid = typeList.some((type) => type.type_label === value);
          if (!isValid) {
            console.error(
              `SKIPPING - Invalid type value <${value}> in sheet <${sheetName}> with title <${title}> and column <${columnName}>`
            );
          }
          return isValid;
        };

        // Simplify the validation checks
        const columnsToValidate = [
          {
            types: filterOptions!.unit_types,
            value: buildingElement.unit_type,
            columnName: "Unit",
            title: buildingElement.title,
          },
          {
            types: filterOptions!.material_types,
            value: buildingElement.material_type,
            columnName: "Material",
            title: buildingElement.title,
          },
          {
            types: filterOptions!.health_status_types,
            value: buildingElement.health_status_type,
            columnName: "Health Status",
            title: buildingElement.title,
          },
          {
            types: filterOptions!.reuse_potential_types,
            value: buildingElement.reuse_potential_type,
            columnName: "Reuse Potential",
            title: buildingElement.title,
          },
          {
            types: filterOptions!.waste_code_types,
            value: buildingElement.waste_code_type,
            columnName: "Waste Code",
            title: buildingElement.title,
          },
          {
            types: filterOptions!.recycling_potential_types,
            value: buildingElement.recycling_potential_type,
            columnName: "Recycling Potential",
            title: buildingElement.title,
          },
        ];

        if (
          columnsToValidate.every((column) =>
            isTypeValid(
              column.types,
              column.value,
              column.columnName,
              column.title
            )
          )
        ) {
          buildingElementUpload.building_elements.push(buildingElement);
        }
      }

      setBuildingElementsToUpload(buildingElementUpload);
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
    if (!buildingElementUploadToUpload) {
      toast.error("No building elements to upload");
      return;
    }

    if (buildingElementUploadToUpload.building_elements.length === 0) {
      toast.error("No building elements to upload");
      return;
    }

    try {
      await createBuildingElementUpload(buildingElementUploadToUpload);
      toast.success("Successfully uploaded building elements");
      setBuildingElementsToUpload(undefined);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload building elements");
    }
  };

  if (error) {
    return <div>Failed to load</div>;
  }

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
      {buildingElementUploadToUpload?.building_elements?.map(
        (buildingElementUploadToUpload, index) => (
          <BuildingElementCard
            data={buildingElementUploadToUpload}
            key={index}
            className="mt-8"
          />
        )
      )}
      <Button
        className="mt-8"
        variant={
          buildingElementUploadToUpload?.building_elements?.length === 0
            ? "disabled"
            : "primary"
        }
        size="sm"
        disabled={
          buildingElementUploadToUpload?.building_elements?.length === 0
        }
        onClick={async () => await upload()}
      >
        Upload {buildingElementUploadToUpload?.building_elements?.length} Items
      </Button>
    </>
  );
}
