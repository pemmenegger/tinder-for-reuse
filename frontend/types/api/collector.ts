/////////////////////////////////////////////////////////////////////////////
// Do not modify this file directly. It is created from the API definition //
// See: ./shared/schemas/collector_schema.py                               //
/////////////////////////////////////////////////////////////////////////////

import { UnifiedTypeRead } from "./type";

type CollectorBase = {
  name: string;
  address: string;
  zip_code: string;
  city: string;
  latitude: number;
  longitude: number;
  email?: string;
  phone?: string;

  material_types: string[];
  waste_code_types: string[];
  authorized_vehicle_types: string[];
  circular_strategy_types: string[];
};

export type CollectorRead = CollectorBase & {
  id: number;
};

export type CollectorCreate = CollectorBase;

export type CollectorFilterOptions = {
  material_types: UnifiedTypeRead[];
  waste_code_types: UnifiedTypeRead[];
  authorized_vehicle_types: UnifiedTypeRead[];
  circular_strategy_types: UnifiedTypeRead[];
};

export type CollectorFilter = {
  material_type_ids: number[];
  waste_code_type_ids: number[];
  authorized_vehicle_type_ids: number[];
  circular_strategy_type_ids: number[];
};

export type CollectorSearchRequest = {
  query: {
    text: string;
  };
  filter: CollectorFilter;
};
