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

  collection_types: string[];
  authorized_vehicle_types: string[];
  material_recovery_types: string[];
};

export type CollectorRead = CollectorBase & {
  id: number;
};

export type CollectorCreate = CollectorBase;

export type CollectorFilterOptions = {
  collection_types: TypeRead[];
  authorized_vehicle_types: TypeRead[];
  material_recovery_types: TypeRead[];
};

export type CollectorSearchRequest = {
  query: {
    text: string;
  };
  filter: {
    collection_type_ids: number[];
    authorized_vehicle_type_ids: number[];
    material_recovery_type_ids: number[];
  };
};

export type CollectorSearchResponse = {
  results: CollectorRead[];
  hasMore: boolean;
};
