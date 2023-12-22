/////////////////////////////////////////////////////////////////////////////
// Do not modify this file directly. It is created from the API definition //
// See: ./backend/app/schemas/search_schema.py                             //
/////////////////////////////////////////////////////////////////////////////

export interface SearchResponse<T> {
  results: T[];
}

export type SearchRequest = {
  query: any;
  filter: any;
};
