import useSWRImmutable from "swr/immutable";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SearchRequest, SearchResponse } from "@/types/api/search";

function useSearchResults<
  ReqT extends SearchRequest,
  ResT extends SearchResponse<any>
>(searchRequest: ReqT, fetcher: (searchRequest: ReqT) => Promise<ResT>) {
  const swrKey = useMemo(
    () => [JSON.stringify(searchRequest), fetcher],
    [JSON.stringify(searchRequest), fetcher]
  );

  const { data, error, isLoading } = useSWRImmutable(swrKey, async () => {
    return await fetcher(searchRequest);
  });

  return {
    data: data,
    error: error,
    isLoading: isLoading,
  };
}

export default function SearchResults<
  ReqT extends SearchRequest,
  ResT extends SearchResponse<any>
>({
  fetcher,
  searchRequest,
  setTotalResults,
  ResultsWrapper,
}: {
  fetcher: (searchRequest: ReqT) => Promise<ResT>;
  searchRequest: ReqT;
  setTotalResults: Dispatch<SetStateAction<number>>;
  ResultsWrapper: React.ComponentType<any>;
}) {
  const [results, setResults] = useState<ResT[]>([]);
  const { data, error, isLoading } = useSearchResults(searchRequest, fetcher);

  useEffect(() => {
    setResults([]);
  }, [JSON.stringify(searchRequest), fetcher]);

  useEffect(() => {
    if (data?.results) {
      setResults(data.results);
    }
  }, [data]);

  useEffect(() => {
    setTotalResults(results.length);
  }, [results, setTotalResults]);

  if (error) {
    return (
      <div className="text-center py-12 text-dgray border rounded-lg border-dashed">
        <p>Error: {error.message}</p>
        <p>Could not load results. Try again later.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full mb-6">
        <ResultsWrapper results={results} isLoading={isLoading} />
      </div>
    </div>
  );
}
