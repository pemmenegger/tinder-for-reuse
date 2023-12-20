/////////////////////////////////////////////////////////////////////////////
// Do not modify this file directly. It is created from the API definition //
// See: ./backend/app/schemas/items/building_element_schema.py             //
/////////////////////////////////////////////////////////////////////////////

import { CollectorRead } from "../collector";
import { UnifiedTypeRead } from "../type";

type BuildingElementBase = {
  upload_uuid: string;
  address: string;
  latitude: number;
  longitude: number;

  worksheet_type: string;
  category: string;

  reference: string;
  title: string;
  unit_type: string;

  total?: number;
  total_mass_kg?: number;
  total_volume_m3?: number;
  material_type?: string;
  health_status_type?: string;
  reuse_potential_type?: string;
  waste_code_type?: string;
  recycling_potential_type?: string;
  has_energy_recovery?: boolean;
  has_elimination?: boolean;
};

export type BuildingElementCreate = BuildingElementBase;

export type BuildingElementRead = BuildingElementBase & {
  id: number;
};

export type BuildingElementFilterOptions = {
  worksheet_types: UnifiedTypeRead[];
  unit_types: UnifiedTypeRead[];
  material_types: UnifiedTypeRead[];
  health_status_types: UnifiedTypeRead[];
  reuse_potential_types: UnifiedTypeRead[];
  waste_code_types: UnifiedTypeRead[];
  recycling_potential_types: UnifiedTypeRead[];
};

export type BuildingElementSearchRequest = {
  query: {
    text: string;
  };
  filter: {
    worksheet_type_ids: number[];
    unit_type_ids: number[];
    material_type_ids: number[];
    health_status_type_ids: number[];
    reuse_potential_type_ids: number[];
    waste_code_type_ids: number[];
    recycling_potential_type_ids: number[];
  };
};

export type BuildingElementSearchResponse = {
  results: BuildingElementRead[];
};

export type BuildingElementMatchesResponse = {
  results: BuildingElementMatchesRead[];
};

export type BuildingElementMatchesRead = {
  building_elements_read: BuildingElementRead[];
  collectors_read: CollectorRead[];
};
