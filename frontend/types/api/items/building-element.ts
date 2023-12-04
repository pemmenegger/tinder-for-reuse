/////////////////////////////////////////////////////////////////////////////
// Do not modify this file directly. It is created from the API definition //
// See: ./backend/app/schemas/items/building_element_schema.py             //
/////////////////////////////////////////////////////////////////////////////

import { ItemCreate, ItemRead } from "../item";
import { TypeRead } from "../type";

type BuildingElementBase = {
  quantity: number;
  total_mass_kg?: number;
  total_volume_m3?: number;
  l?: number;
  L?: number;
  diameter?: number;
  H?: number;
  P?: number;
  E?: number;
  localization?: string;
  condition?: string;
  reuse_potential?: string;
  drop_off_procedures?: string;
  storage_method?: string;
  lat: number;
  lng: number;
  upload_uuid: string;

  category_type: string;
  unit_type: string;
  constitution_types: string[];
  material_types: string[];
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
  hasMore: boolean;
};
