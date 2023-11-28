import useSWRImmutable from "swr/immutable";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";

export type SearchRequest = {
  query: any;
  filter: any;
};

export type SearchResponse = {
  results: any[];
  hasMore: boolean;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function usePaginatedResults<
  ReqT extends SearchRequest,
  ResT extends SearchResponse
>(
  pageIndex: number,
  searchRequest: ReqT,
  fetcher: (pageIndex: number, searchRequest: ReqT) => Promise<ResT>
) {
  const swrKey = useMemo(
    () => [pageIndex, searchRequest, JSON.stringify(searchRequest)],
    [pageIndex, searchRequest]
  );

  const { data, error, isLoading } = useSWRImmutable(swrKey, async () => {
    await delay(1000);
    return await fetcher(pageIndex, searchRequest);
  });

  return {
    data: data,
    error: error,
    isLoading: isLoading,
  };
}

export default function SearchResults<
  ReqT extends SearchRequest,
  ResT extends SearchResponse
>({
  fetcher,
  searchRequest,
  setTotalResults,
  ResultComponent,
  LoadingSkeletonComponent,
}: {
  fetcher: (pageIndex: number, searchRequest: ReqT) => Promise<ResT>;
  searchRequest: ReqT;
  setTotalResults: Dispatch<SetStateAction<number>>;
  ResultComponent: React.ComponentType<any>;
  LoadingSkeletonComponent: React.ComponentType<any>;
}) {
  const [results, setResults] = useState<any[]>([]);
  const [hasMoreResults, setHasMoreResults] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const { data, error, isLoading } = usePaginatedResults(
    pageIndex,
    searchRequest,
    fetcher
  );

  useEffect(() => {
    setResults([]);
    setHasMoreResults(true);
    setPageIndex(0);
  }, [JSON.stringify(searchRequest)]);

  useEffect(() => {
    if (data?.results) {
      setResults((prevItems) => [...prevItems, ...data.results]);
    }
    if (data?.hasMore !== undefined) {
      setHasMoreResults(data.hasMore);
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
        {results.map((result, index) => (
          <ResultComponent key={index} {...result} />
        ))}
        {isLoading && (
          <>
            <LoadingSkeletonComponent />
            <LoadingSkeletonComponent />
            <LoadingSkeletonComponent />
          </>
        )}
      </div>
      {hasMoreResults ? (
        <button
          className={`w-26 rounded-lg ${
            isLoading
              ? "bg-rondas-black/30 border-black/5"
              : "bg-rondas-black border-black"
          } text-white border font-body-400 tracking-wide py-3 px-6 shadow-md flex items-center justify-center text-sm`}
          onClick={() => setPageIndex(pageIndex + 1)}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 mr-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              <span>Loading...</span>
            </>
          ) : (
            <span>Load More</span>
          )}
        </button>
      ) : (
        <p className="text-gray-400">This is it! No more results to show.</p>
      )}
    </div>
  );
}
