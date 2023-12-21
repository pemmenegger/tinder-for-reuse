export interface SearchResponse<T> {
  results: T[];
}

export type SearchRequest = {
  query: any;
  filter: any;
};
