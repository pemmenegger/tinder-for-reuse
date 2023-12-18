/////////////////////////////////////////////////////////////////////////////
// Do not modify this file directly. It is created from the API definition //
// See: ./shared/schemas/collector_schema.py                               //
/////////////////////////////////////////////////////////////////////////////

import { TypeRead } from "./type";

type CollectorBase = {
  name: string;
  address: string;
  zip_code: string;
  city: string;
  lat: number;
  lng: number;
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
  material_types: TypeRead[];
  waste_code_types: TypeRead[];
  authorized_vehicle_types: TypeRead[];
  circular_strategy_types: TypeRead[];
};

export type CollectorSearchRequest = {
  query: {
    text: string;
  };
  filter: {
    material_type_ids: number[];
    waste_code_type_ids: number[];
    authorized_vehicle_type_ids: number[];
    circular_strategy_type_ids: number[];
  };
};

export type CollectorSearchResponse = {
  results: CollectorRead[];
  hasMore: boolean;
};
