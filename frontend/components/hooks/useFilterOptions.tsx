import { useEffect, useState } from "react";

export const useFilterOptions = <T,>(fetchFilterOptions: () => Promise<T>) => {
  const [filterOptions, setFilterOptions] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getFilterOptions() {
      try {
        const options = await fetchFilterOptions();
        setFilterOptions(options);
      } catch (error) {
        setError("Failed to fetch filter options.");
        console.error("Failed to fetch filter options:", error);
      }
    }

    getFilterOptions();
  }, [fetchFilterOptions]);

  return { filterOptions, error };
};
