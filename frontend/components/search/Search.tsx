import SearchInputContainer, {
  FilterConfig,
} from "@/components/search/SearchInputContainer";
import SearchResults, {
  SearchRequest,
  SearchResponse,
} from "@/components/search/SearchResults";
import { useState } from "react";

export type SearchResultsWrapperType = {
  results: any[];
  isLoading: boolean;
};

export default function Search<
  ReqT extends SearchRequest,
  ResT extends SearchResponse
>({
  fetcher,
  initialSearchRequest,
  filterConfigs,
  ResultsWrapper,
}: {
  fetcher: (searchRequest: ReqT) => Promise<ResT>;
  initialSearchRequest: ReqT;
  filterConfigs: FilterConfig[];
  ResultsWrapper: React.ComponentType<SearchResultsWrapperType>;
}) {
  const [searchRequest, setSearchRequest] =
    useState<ReqT>(initialSearchRequest);
  const [totalResults, setTotalResults] = useState(0);

  return (
    <div className="flex justify-center min-h-screen">
      <div className="flex flex-col w-full">
        <SearchInputContainer
          searchRequest={searchRequest}
          setSearchRequest={setSearchRequest}
          totalResults={totalResults}
          filterConfigs={filterConfigs}
        />
        <SearchResults
          fetcher={fetcher}
          searchRequest={searchRequest}
          setTotalResults={setTotalResults}
          ResultsWrapper={ResultsWrapper}
        />
        {/* <button
          onClick={() => {
            console.log(searchRequest);
          }}
        >
          Log search request
        </button> */}
      </div>
    </div>
  );
}
