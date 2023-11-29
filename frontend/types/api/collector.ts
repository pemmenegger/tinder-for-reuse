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
};

export type CollectorRead = CollectorBase & {
  id: number;
};

export type CollectorFilterOptions = {
  collection_types: TypeRead[];
};

export type CollectorSearchRequest = {
  query: {
    text: string;
  };
  filter: {
    collection_type_ids: number[];
  };
};

export type CollectorSearchResponse = {
  results: CollectorRead[];
  hasMore: boolean;
};
