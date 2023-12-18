/////////////////////////////////////////////////////////////////////////////
// Do not modify this file directly. It is created from the API definition //
// See: ./backend/app/schemas/contractor_schema.py                         //
/////////////////////////////////////////////////////////////////////////////

import { TypeRead } from "./type";

type ContractorBase = {
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
};

export type ContractorRead = ContractorBase & {
  id: number;
};

export type ContractorCreate = ContractorBase;

export type ContractorFilterOptions = {
  material_types: TypeRead[];
  waste_code_types: TypeRead[];
};

export type ContractorSearchRequest = {
  query: {
    text: string;
  };
  filter: {
    material_type_ids: number[];
    waste_code_type_ids: number[];
  };
};

export type ContractorSearchResponse = {
  results: ContractorRead[];
  hasMore: boolean;
};
