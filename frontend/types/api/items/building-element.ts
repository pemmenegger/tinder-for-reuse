/////////////////////////////////////////////////////////////////////////////
// Do not modify this file directly. It is created from the API definition //
// See: ./backend/app/schemas/items/building_element_schema.py             //
/////////////////////////////////////////////////////////////////////////////

import { CollectorRead } from "../collector";
import { ItemCreate, ItemRead } from "../item";
import { TypeRead } from "../type";

type BuildingElementBase = {
  total_mass?: number;
  total_volume?: number;
  material?: string;
  condition_sanitary?: string;
  reuse_potential?: string;
  waste_code?: string;
  recycling_potential?: string;
  energy_recovery?: string;
  disposal?: string;
  address: string;
  lat: number;
  lng: number;
  upload_uuid: string;

  category_type: string;
  worksheet: string;

  // TODO material not standardized? list of strings?
};

export type BuildingElementCreate = BuildingElementBase & {
  item: ItemCreate;
};

export type BuildingElementRead = BuildingElementBase & {
  id: number;
  item: ItemRead;
};

export type BuildingElementFilterOptions = {
  unit_types: TypeRead[];
  category_types: TypeRead[];
  constitution_types: TypeRead[];
  material_types: TypeRead[];
};

export type BuildingElementSearchRequest = {
  query: {
    text: string;
  };
  filter: {
    unit_type_ids: number[];
    category_type_ids: number[];
    constitution_type_ids: number[];
    material_type_ids: number[];
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
